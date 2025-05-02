import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Operator types for filter conditions
 */
export type FilterOperator = 
  | 'eq'      // equals
  | 'neq'     // not equals
  | 'gt'      // greater than
  | 'gte'     // greater than or equal
  | 'lt'      // less than
  | 'lte'     // less than or equal
  | 'like'    // LIKE pattern matching
  | 'ilike'   // case insensitive LIKE
  | 'is'      // test for NULL
  | 'in'      // IN a list of values
  | 'contains' // array contains
  | 'contained'; // array is contained by

/**
 * A single filter condition
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

/**
 * Filter configuration for queries
 */
export interface FilterConfig {
  conditions: FilterCondition[];
  matchAny?: boolean; // If true, conditions are joined with OR, otherwise AND
}

/**
 * Build filter conditions from a filters object
 * 
 * @param filters - Object with filter values
 * @param defaultOperator - Default operator to use for conditions
 * @returns Array of filter conditions
 */
export function buildFilterConditions(
  filters: Record<string, any>,
  defaultOperator: FilterOperator = 'eq'
): FilterCondition[] {
  return Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([field, value]) => ({
      field,
      operator: defaultOperator,
      value
    }));
}

/**
 * Apply filter conditions to a PostgrestFilterBuilder
 * 
 * @param query - The query builder to apply filters to
 * @param config - Filter configuration
 * @returns The modified query builder
 */
export function applyFilters<T>(
  query: PostgrestFilterBuilder<T>,
  config: FilterConfig
): PostgrestFilterBuilder<T> {
  const { conditions, matchAny = false } = config;
  
  // No conditions to apply
  if (!conditions || conditions.length === 0) {
    return query;
  }
  
  // Apply OR conditions
  if (matchAny && conditions.length > 1) {
    const orConditions = conditions.map(({ field, operator, value }) => {
      return buildFilterExpression(field, operator, value);
    }).join(',');
    
    return query.or(orConditions);
  }
  
  // Apply AND conditions
  return conditions.reduce((acc, { field, operator, value }) => {
    return applyFilter(acc, field, operator, value);
  }, query);
}

/**
 * Apply a single filter to a query
 * 
 * @param query - The query builder
 * @param field - Field name
 * @param operator - Filter operator
 * @param value - Value to filter by
 * @returns The modified query builder
 */
function applyFilter<T>(
  query: PostgrestFilterBuilder<T>,
  field: string,
  operator: FilterOperator,
  value: any
): PostgrestFilterBuilder<T> {
  switch (operator) {
    case 'eq':
      return query.eq(field, value);
    case 'neq':
      return query.neq(field, value);
    case 'gt':
      return query.gt(field, value);
    case 'gte':
      return query.gte(field, value);
    case 'lt':
      return query.lt(field, value);
    case 'lte':
      return query.lte(field, value);
    case 'like':
      return query.like(field, value);
    case 'ilike':
      return query.ilike(field, value);
    case 'is':
      return query.is(field, value);
    case 'in':
      return query.in(field, Array.isArray(value) ? value : [value]);
    case 'contains':
      return query.contains(field, value);
    case 'contained':
      return query.contained(field, value);
    default:
      return query;
  }
}

/**
 * Build a filter expression string for OR conditions
 * 
 * @param field - Field name
 * @param operator - Filter operator
 * @param value - Value to filter by
 * @returns Filter expression string
 */
function buildFilterExpression(
  field: string,
  operator: FilterOperator,
  value: any
): string {
  const valueStr = formatValueForExpression(value);
  return `${field}.${operator}.${valueStr}`;
}

/**
 * Format a value for use in a filter expression
 * 
 * @param value - The value to format
 * @returns Formatted value as a string
 */
function formatValueForExpression(value: any): string {
  if (value === null) {
    return 'null';
  }
  
  if (typeof value === 'string') {
    // Handle LIKE/ILIKE patterns
    if (value.includes('*')) {
      return value.replace(/\*/g, '%');
    }
    return value;
  }
  
  if (Array.isArray(value)) {
    return `(${value.map(v => formatValueForExpression(v)).join(',')})`;
  }
  
  return String(value);
}

/**
 * Parse filter parameters from query parameters
 * 
 * @param query - Request query parameters
 * @param allowedFields - List of fields that can be filtered
 * @returns Object with parsed filters
 */
export function parseFilterParams(
  query: Record<string, any>,
  allowedFields: string[]
): Record<string, any> {
  const filters: Record<string, any> = {};
  
  Object.entries(query).forEach(([key, value]) => {
    // Skip pagination parameters
    if (['page', 'limit', 'sort', 'order'].includes(key)) {
      return;
    }
    
    // Check if key is an allowed field
    const baseField = key.split('_')[0];
    if (allowedFields.includes(baseField)) {
      // Handle operator suffixes like name_like, age_gt
      const parts = key.split('_');
      const field = parts[0];
      const operator = parts.length > 1 ? parts[parts.length - 1] : 'eq';
      
      // Store in filters with correct type conversion
      filters[key] = parseFilterValue(value, operator);
    }
  });
  
  return filters;
}

/**
 * Parse filter value with appropriate type conversion
 * 
 * @param value - Raw value from query string
 * @param operator - The filter operator
 * @returns Parsed value
 */
function parseFilterValue(value: any, operator: string): any {
  // Array values for 'in' operator (comma-separated)
  if (operator === 'in' && typeof value === 'string') {
    return value.split(',').map(v => parseFilterValue(v, 'eq'));
  }
  
  // Boolean conversion
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Null value
  if (value === 'null') return null;
  
  // Number conversion (if it looks like a number)
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  
  // Date conversion (if it looks like an ISO date)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.test(value)) {
    return new Date(value).toISOString();
  }
  
  // Default: return as string
  return value;
}

/**
 * Create a search object for text search across multiple columns
 * 
 * @param searchTerm - Search term
 * @param searchFields - Fields to search in
 * @returns Filter config for text search
 */
export function createTextSearchFilter(
  searchTerm: string,
  searchFields: string[]
): FilterConfig {
  if (!searchTerm || !searchFields.length) {
    return { conditions: [] };
  }
  
  const conditions = searchFields.map(field => ({
    field,
    operator: 'ilike' as FilterOperator,
    value: `%${searchTerm}%`
  }));
  
  return {
    conditions,
    matchAny: true
  };
}
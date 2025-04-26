import { propertyData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Property = () => {
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">{propertyData.name}</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <i className="ri-edit-line mr-2"></i>
            Edit Property
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass md:col-span-2">
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Description</h3>
                    <p className="mt-1">{propertyData.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Address</h3>
                      <p className="mt-1">{propertyData.address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Tax Information</h3>
                      <p className="mt-1">{propertyData.taxInfo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <p className="text-neutral-500 text-sm">Map view</p>
                  <p className="text-xs text-neutral-400">Coordinates: {propertyData.geoCoordinates.latitude}, {propertyData.geoCoordinates.longitude}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Property Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {propertyData.mediaGallery.map((item, index) => (
                  <div key={index} className="aspect-video rounded-md bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <div className="text-center">
                      <i className="ri-image-line text-2xl text-neutral-400"></i>
                      <p className="mt-2 text-sm text-neutral-500">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Property Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {propertyData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md bg-neutral-100 dark:bg-neutral-800">
                    <i className="ri-checkbox-circle-line text-green-500 mr-2"></i>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-neutral-500">Phone</h3>
                  <p className="mt-1">{propertyData.contactInfo.phone}</p>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-neutral-500">Email</h3>
                  <p className="mt-1">{propertyData.contactInfo.email}</p>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-neutral-500">Website</h3>
                  <p className="mt-1">{propertyData.contactInfo.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Property;

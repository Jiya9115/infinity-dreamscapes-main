import { useEffect, useState } from "react";
import { Loader2, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*") 
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      if (data) setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error } = await supabase.from("generated_images").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Image deleted successfully");
      setImages(images.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground mt-14">Generated Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="glass rounded-xl border border-border/50 overflow-hidden group">
            <div className="relative aspect-square">
              <img src={img.image_url} alt={img.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                
                <div className="flex justify-end gap-2">
                  <a href={img.image_url} download className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors" title="Download">
                    <Download className="w-4 h-4 text-white" />
                  </a>
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg backdrop-blur-sm transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-medium text-white line-clamp-2">{img.prompt}</p>
                  <p className="text-xs text-white/70 mt-1">User ID: {img.user_id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">No images generated yet.</p>}
      </div>
    </div>
  );
};

export default AdminImages;
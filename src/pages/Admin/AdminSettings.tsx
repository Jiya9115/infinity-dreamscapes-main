import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Assuming you have sonner for toasts, or replace with alert()

const AdminSettings = () => {
    const [freeCredits, setFreeCredits] = useState<number>(5);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load the settings when the page opens
    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("platform_settings" as any)
                .select("free_credits")
                .single();

            if (data) setFreeCredits(data.free_credits);
            if (error) console.error("Error loading settings", error);
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    // Save the settings when you click the button
    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from("platform_settings" as any)
            .update({ free_credits: freeCredits } as any)
            .eq("id", 1);

        if (error) {
            toast.error("Failed to save settings");
            console.error(error);
        } else {
            toast.success("Settings saved successfully!");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-display font-bold text-foreground mt-14">Platform Settings</h1>

            <div className="glass p-6 rounded-xl border border-border/50 space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Generation Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Free Tier Credits</label>
                            <input
                                type="number"
                                value={freeCredits}
                                onChange={(e) => setFreeCredits(Number(e.target.value))}
                                className="w-full bg-white/5 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Number of free images a user gets upon sign up.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                    <h3 className="text-lg font-medium text-foreground mb-4">API Configuration</h3>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                        <p className="text-sm text-orange-400">
                            For security, API keys cannot be changed from the frontend. Please update them directly in your Supabase Dashboard (Edge Functions &gt; Secrets).
                        </p>
                    </div>
                    <div className="space-y-4 opacity-60 pointer-events-none">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Hugging Face API Key</label>
                            <input type="password" value="••••••••••••••••" readOnly className="w-full bg-white/5 border border-border/50 rounded-lg px-4 py-2 text-foreground" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Stripe Secret Key</label>
                            <input type="password" value="••••••••••••••••" readOnly className="w-full bg-white/5 border border-border/50 rounded-lg px-4 py-2 text-foreground" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
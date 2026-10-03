"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, getStatusColor } from "@/utils/formatters";
import { Upload, FileText, Eye, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUploader } from "@/components/common/FileUploader";
import { useAuth } from "@/context/AuthContext";
import { EmptyState, emptyStates } from "@/components/common/EmptyState";
import { useSubmissions } from "@/hooks/useApi";

const MAX_ANIMATED = 10;

export default function Submissions() {
  const { user } = useAuth();
  const { data: submissions = [], isLoading, refetch } = useSubmissions();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("REPORT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a submission title");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/student/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          fileUrl: selectedFile ? `/uploads/${selectedFile.name}` : null,
          email: user?.email,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Submission uploaded successfully");
        setOpen(false);
        setTitle("");
        setSelectedFile(null);
        await refetch();
      } else {
        toast.error(json.error || "Failed to upload submission");
      }
    } catch {
      toast.error("Network error uploading submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#003366] dark:text-[#ff8c00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Submissions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Upload and track course deliverables and reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" /> Sync
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Upload className="w-4 h-4 mr-2" />Upload Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Submission</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label className="text-xs">Document Title</Label>
                  <Input
                    placeholder="e.g. Month 1 Progress Report / Architectural Blueprint"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Select Artifact File</Label>
                  <FileUploader
                    accept=".pdf,.docx,.doc"
                    maxSizeMB={15}
                    onFilesSelected={(files) => setSelectedFile(files[0] || null)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {submissions.length === 0 ? (
        <EmptyState {...emptyStates.submissions} title="No submissions recorded" description="You have not uploaded any technical reports or assessment deliverables yet." />
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={i < MAX_ANIMATED ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={i < MAX_ANIMATED ? { delay: i * 0.05 } : undefined}
            >
              <Card className="hover:border-primary/20 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{sub.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.due_date ? `Due ${formatDate(sub.due_date)}` : (sub.submitted_date ? `Submitted ${formatDate(sub.submitted_date)}` : "Ongoing")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(sub.status)}>{sub.status}</Badge>
                    {sub.file_url && (
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

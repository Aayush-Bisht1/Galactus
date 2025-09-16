"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

const FileName = [
    "Maintainance CSV",
    "Fitness Certificates CSV",
    "Cleaning Schedule CSV",
    "Branding Schedule CSV",
    "Work Order Maximo CSV",
    "Mileage Logs CSV"
];

export function Form() {
    const [files, setFiles] = useState<(File | null)[]>(Array(6).fill(null));

    console.log("Current files:", files);

    const handleFileChange = (index: number, file: File | null) => {
        if (file) {
            // Validate CSV file
            if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                const newFiles = [...files];
                newFiles[index] = file;
                setFiles(newFiles);
            } else {
                alert("Please select a valid CSV file.");
                // Clear the input
                const input = document.getElementById(`csvFile${index}`) as HTMLInputElement;
                if (input) input.value = "";
            }
        } else {
            // Handle file removal
            const newFiles = [...files];
            newFiles[index] = null;
            setFiles(newFiles);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emptyFiles = files.some((file) => file === null);
        if (emptyFiles) {
            alert("Please upload all required CSV files before submitting.");
            return;
        }

        const formData = new FormData();

        files.forEach((file, index) => {
            if (file) {
                const fieldName = FileName[index].toLowerCase().replace(/\s+/g, '_').replace('csv', '');
                formData.append(fieldName, file, file.name);
            }
        });


        // try {
        //     const res = await fetch("/api/upload", {
        //         method: "POST",
        //         body: formData,
        //     });

        //     if (res.ok) {
        //         const result = await res.json();
        //         console.log("Upload successful:", result);
        //         alert("CSV files uploaded successfully!");
        //         // Reset form
        //         setFiles(Array(6).fill(null));
        //         // Clear all file inputs
        //         files.forEach((_, index) => {
        //             const input = document.getElementById(`csvFile${index}`) as HTMLInputElement;
        //             if (input) input.value = "";
        //         });
        //     } else {
        //         const errorText = await res.text();
        //         console.error("Upload failed:", errorText);
        //         alert(`Upload failed: ${res.status} ${res.statusText}`);
        //     }
        // } catch (error) {
        //     console.error("Error uploading files:", error);
        //     alert("Error uploading files. Please check your connection and try again.");
        // }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-6">
            <CardHeader>
                <CardTitle>Upload your Train CSV data</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    {files.map((file, index) => (
                        <div key={index} className="space-y-1 mb-4">
                            <Label
                                htmlFor={`csvFile${index}`}
                                className="text-sm font-medium"
                            >
                                {FileName[index]}
                            </Label>
                            <Input
                                id={`csvFile${index}`}
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) =>
                                    handleFileChange(index, e.target.files?.[0] || null)
                                }
                                className="file:mr-4 file:px-4 file:py-1 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {file && (
                                <p className="text-xs text-green-600 mt-1">
                                    ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </p>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={files.every((file) => file === null)}
                    >
                        Submit Files
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        {files.filter(file => file !== null).length} of {files.length} files uploaded
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
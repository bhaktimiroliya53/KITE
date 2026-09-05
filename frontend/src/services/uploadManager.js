import API from "./api";

const UPLOAD_PROGRESS_KEY = "kite_upload_progress";

const notifyProgress = (data) => {
    localStorage.setItem(
        UPLOAD_PROGRESS_KEY,
        JSON.stringify(data)
    );

    window.dispatchEvent(
        new CustomEvent("kite-upload-progress", {
            detail: data,
        })
    );
};

export const getUploadProgress = () => {
    try {
        const saved = localStorage.getItem(
            UPLOAD_PROGRESS_KEY
        );

        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("UPLOAD PROGRESS READ ERROR =>", error);
        return null;
    }
};

export const uploadPostImage = ({
    imageBlob,
    postPayload,
}) => {
    return new Promise((resolve, reject) => {
        if (!imageBlob) {
            reject(new Error("No image selected."));
            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            imageBlob,
            "kite-moment.jpg"
        );

        formData.append(
            "upload_preset",
            "kite_upload"
        );

        notifyProgress({
            status: "uploading",
            progress: 0,
        });

        const xhr = new XMLHttpRequest();

        xhr.open(
            "POST",
            "https://api.cloudinary.com/v1_1/kiteapp/image/upload"
        );

        xhr.upload.addEventListener(
            "progress",
            (event) => {
                if (!event.lengthComputable) return;

                const progress = Math.round(
                    (event.loaded / event.total) * 100
                );

                notifyProgress({
                    status: "uploading",
                    progress,
                });
            }
        );

        xhr.onload = async () => {
            try {
                const cloudData = JSON.parse(
                    xhr.responseText
                );

                if (
                    xhr.status < 200 ||
                    xhr.status >= 300 ||
                    !cloudData.secure_url
                ) {
                    throw new Error("Image upload failed.");
                }

                notifyProgress({
                    status: "creating",
                    progress: 100,
                });

                await API.post("/posts", {
                    ...postPayload,
                    image: cloudData.secure_url,
                });

                notifyProgress({
                    status: "complete",
                    progress: 100,
                });

                resolve({
                    imageUrl: cloudData.secure_url,
                });
            } catch (error) {
                notifyProgress({
                    status: "error",
                    progress: 0,
                });

                reject(error);
            }
        };

        xhr.onerror = () => {
            const error = new Error(
                "Image upload failed."
            );

            notifyProgress({
                status: "error",
                progress: 0,
            });

            reject(error);
        };

        xhr.onabort = () => {
            const error = new Error(
                "Image upload was cancelled."
            );

            notifyProgress({
                status: "error",
                progress: 0,
            });

            reject(error);
        };

        xhr.send(formData);
    });
};

export const clearUploadProgress = () => {
    localStorage.removeItem(
        UPLOAD_PROGRESS_KEY
    );

    window.dispatchEvent(
        new CustomEvent("kite-upload-progress", {
            detail: {
                status: "hidden",
                progress: 0,
            },
        })
    );
};
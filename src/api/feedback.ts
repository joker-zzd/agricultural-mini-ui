import request from "../utils/request";

export const submitFeedback = (data: {
  content: string;
  image: string;
  contactDetails: string;
}) => {
  return request.post({
    url: "/api/feedback/add",
    data,
  });
};

export const uploadFeedbackImage = (target: { file: File }) => {
  const formData = new FormData();
  formData.append("file", target.file);
  return request.post({
    url: `/api/file/upload`,
    data: formData,
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });
};

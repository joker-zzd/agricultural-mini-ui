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

export const uploadFeedbackImage = (file: File) => {
  return request.post({
    url: `/api/feedback/upload?file=${file}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

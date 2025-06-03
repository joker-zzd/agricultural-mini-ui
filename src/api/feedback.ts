import request from "../utils/request";

interface FeedbackDTO {
  content: string;
  image: string;
  contactDetails: string;
}

export const submitFeedback = (data: FeedbackDTO) => {
  return request.post({
    url: "/api/feedback/add",
    data,
  });
};

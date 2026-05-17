import { title } from "process";
import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "We couldn't find any data here. It’s emptier than a lecture hall on a Friday morning.",
  button: {
    text: "Go Back Home",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Oops! Something went wrong",
  message:
    "Something went wrong in the backend. It probably needs more coffee and a quick retry.",
  button: {
    text: "Retry",
    href: ROUTES.HOME,
  },
};

export const EMPTY_QUESTIONS = {
  title: "No Curiosity Detected",
  message:
    "It looks like nobody has asked anything yet. Don't be shy—there are no stupid questions here!",
  button: {
    text: "Ask the First Question",
    href: ROUTES.ASKQUESTION,
  },
};

export const EMPTY_TAGS = {
  title: "Untagged Territory",
  message:
    "The tag cloud is currently a mist. Add some keywords to help others find what they need.",
  button: {
    text: "Create a Tag",
    href: ROUTES.TAGS,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "A Blank Canvas",
  message: "You haven't saved any collections yet. Start hoarding knowledge for your next exam!",
  button: {
    text: "Start a Collection",
    href: ROUTES.COLLECTION,
  },
};

export const EMPTY_ANSWERS={
  title:"No Answer Found",
  message:"No one has answered yet. Be the first to answer!",
}

export const EMPTY_USERS={
  title:"No User Found",
  message:"No one has registered yet. Be the first to register!",
}

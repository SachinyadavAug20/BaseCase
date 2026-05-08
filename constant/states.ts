import ROUTES from "./routes";

export const DEFAULT_EMPTY={
  title:"No data found",
  message:"Looks like there is no data here yet. Please check back later",
  button:{
    text:"Add Data",
    href:ROUTES.HOME,
  }
}

export const DEFAULT_ERROR={
  title:"Oops! Something went wrong",
  message:"Looks like some slop passed by :(, Give it another shot",
  button:{
    text:"Retry",
    href:ROUTES.HOME,
  }
}

export const EMPTY_QUESTIONS={
  title:"No questions found",
  message:"Looks like there are no question here yet. Go ahead and ask a question",
  button:{
    text:"Ask a Question",
    href:ROUTES.ASKQUESTION,
  }
}

export const EMPTY_TAGS={
  title:"No tags found",
  message:"The tag cloud is empty. Add some keywords to make it rain.",
  button:{
    text:"Add a Tag",
    href:ROUTES.TAGS,
  }
}

export const EMPTY_COLLECTIONS={
  title:"Collections are empty",
  message:"Looks like haven't created any collections yet.Start curating something extraordinary today",
  button:{
    text:"Create Collection",
    href:ROUTES.COLLECTION,
  }
}

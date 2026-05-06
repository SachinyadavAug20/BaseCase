"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Controller,
  DefaultValues,
  FieldValue,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AskQuestionSchema, EditQuestionSchema } from "@/lib/validation";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { z } from "zod";
import TagCard from "../card/TagCard";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/constant/routes";
import { IQuestion } from "@/types/global";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});
interface Params {
  question?: IQuestion;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
  const router = useRouter();
  const editorred = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });
  const handleInputTags = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] },
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // privents the enter key from submitting the form
      const tagInput = e.currentTarget.value.trim();
      if (
        tagInput &&
        tagInput.length <= 15 &&
        !field.value.includes(tagInput)
      ) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };
  const handleRemoveTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);
    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required",
      });
    }
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>,
  ) => {
    startTransition(async () => {
      if (isEdit && question) {
        const result = await editQuestion({
          title: data.title,
          content: data.content,
          tags: data.tags,
          questionId: question?._id,
        });
        if (result.success) {
          toast.success("Success", {
            description: "Question updated successfully",
          });
          if (result.data)
            router.push(`${ROUTES.QUESTIONS}/${result.data?._id}`);
        } else {
          toast(`Error ${result.status}`, {
            description: result?.error?.message || "Something went wrong",
          });
        }
      } else {
        const result = await createQuestion(data);
        if (result.success) {
          toast.success("Success", {
            description: "Question created successfully",
          });
          if (result.data)
            router.push(`${ROUTES.QUESTIONS}/${result.data?._id}`);
        } else {
          toast(`Error ${result.status}`, {
            description: result?.error?.message || "Something went wrong",
          });
        }
        console.log(data);
      }
    });
  };

  return (
    <>
      <form
        id="form-rhf-input"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FieldGroup className="flex w-full flex-col">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-rhf-input-username"
                  className="paragraph-semibold text-dark200_light800 "
                >
                  Question Title<span className="text-primary-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-username"
                  aria-invalid={fieldState.invalid}
                  autoComplete={field.name}
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription className="body-regular text-light-500 mt-2.5">
                  Be specific and imagine you're asking a question to another
                  person
                </FieldDescription>
              </Field>
            )}
          />
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-rhf-input-username"
                  className="paragraph-semibold text-dark200_light800 "
                >
                  Detailed explaination of your problem
                  <span className="text-primary-500">*</span>
                </FieldLabel>
                <Editor
                  editorRef={editorred}
                  value={field.value}
                  fieldchange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription className="body-regular text-light-500 mt-2.5">
                  Introduce the problem and expand on what you've put in your
                  title
                </FieldDescription>
              </Field>
            )}
          />
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-rhf-input-username"
                  className="paragraph-semibold text-dark200_light800 "
                >
                  Tags<span className="text-primary-500">*</span>
                </FieldLabel>
                <div>
                  <Input
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    autoComplete={field.name}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => {
                      handleInputTags(e, field);
                    }}
                  />
                  <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                    {field.value.length > 0 &&
                      field.value.map((tag: string) => {
                        return (
                          <TagCard
                            key={tag}
                            _id={tag}
                            name={tag}
                            compact
                            remove={true}
                            isButton
                            handleRemove={() => {
                              handleRemoveTag(tag, field);
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription className="body-regular text-light-500 mt-2.5">
                  Add upto 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
        <div className=" flex justify-end mt-16">
          <Button
            type="submit"
            form="form-rhf-input"
            disabled={isPending}
            className="primary-gradient !text-light-900 w-fit px-5 py-1"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-r-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <> {isEdit?"Edit Question":"Ask a Question"}</>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default QuestionForm;

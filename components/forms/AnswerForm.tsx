"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { AnswerSchema } from "@/lib/validation";
import { useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}
const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmiting] = useState(false); // for modify answer
  const session = useSession();
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId: questionId,
        content: values.content,
      });
      if (result.success) {
        form.reset();
        toast.success("Success", {
          description: "Answer created successfully",
        });
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast.error("Error", {
          description: result.error?.message,
        });
      }
    });
  };
  const generateAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.info("Login to generate answer", {
        description: "You need to be logged in to generate an answer",
      });
    }
    setIsAISubmiting(true);
    const userAnswer=editorRef.current?.getMarkdown();
    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );
      if (!success) {
        return toast.error("Error", {
          description: error?.message,
        });
      }

      const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();
      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        form.trigger("content"); // validate the content
      }
      toast.success("Generated", {
        description: "AI Answer generated successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : `Error generating answer ${error}`,
      });
    } finally {
      setIsAISubmiting(false);
    }
  };

  return (
    <div className="flex items-center justify-center  w-full flex-col">
      <h4 className="paragraph-semibold text-dark400_light800 place-self-start ml-2 mt-1">
        Write your answer here
      </h4>
      <div className="flex flex-col gap-5 sm:flex-row  sm:gap-2 place-self-end mr-2 mb-4">
        <Button
          className="btn light-border-2 gap-1.5 rounded-md hover:text-primary-500 hover:background-dark400_light900 border place-self-end px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" /> Generating... 
            </>
          ) : (
            <>
              <Image
                src="/icons/star.svg"
                width={12}
                height={12}
                alt="Generate AI answer"
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Card className="w-full background-dark400_light900">
        <form id="form-rhf-input" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => {
              return (
                <Field className="w-full h-full">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldchange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="ml-3" />
                  )}
                </Field>
              );
            }}
          />
          <div className="flex justify-end mr-3 mt-2">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" /> Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AnswerForm;

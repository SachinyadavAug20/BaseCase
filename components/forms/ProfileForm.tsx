"use client";
import { IUser } from "@/dataBase/user.model";
import { UpdateUser } from "@/lib/actions/user.action";
import { ProfileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Card } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import ROUTES from "@/constant/routes";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const ProfileForm = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  });
  const handleUpdateProfile = async (value: z.infer<typeof ProfileSchema>) => {
    startTransaction(async () => {
      const result = await UpdateUser({ ...value });
      if (result.success) {
        toast.success("Success", {
          description: "Profile updated successfully",
        });
        router.push(`${ROUTES.PROFILE}/${user?._id}`);
      } else {
        toast.error(`Error (${result.status})`, {
          description: result.error?.message,
        });
      }
    });
  };
  return (
    <Card className="bg-[lab(2.75381% 0 0)] outline-[lab(2.75381% 0 0)] border-[lab(2.75381% 0 0)] p-5 mt-2 w-full">
      <form
        className="w-full mt-9 flex w-full flex-col gap-9"
        id="form-rhf-input"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => {
            return (
              <Field className="space-y-3.5">
                <FieldLabel className="paragraph-semibold text-dark400_light800">
                  Name<span className="text-primary-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your name"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="ml-3" />
                )}
              </Field>
            );
          }}
        />
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => {
            return (
              <Field className="space-y-3.5">
                <FieldLabel className="paragraph-semibold text-dark400_light800">
                  Username<span className="text-primary-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your username"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="ml-3" />
                )}
              </Field>
            );
          }}
        />
        <Controller
          control={form.control}
          name="portfolio"
          render={({ field, fieldState }) => {
            return (
              <Field className="space-y-3.5">
                <FieldLabel className="paragraph-semibold text-dark400_light800">
                  Portfolio Link<span className="text-primary-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your portfolio link"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="ml-3" />
                )}
              </Field>
            );
          }}
        />
        <Controller
          control={form.control}
          name="location"
          render={({ field, fieldState }) => {
            return (
              <Field className="space-y-3.5">
                <FieldLabel className="paragraph-semibold text-dark400_light800">
                  Location<span className="text-primary-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="where are you from? (e.g. Koparkhairane, Navi mumbai,India)"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="ml-3" />
                )}
              </Field>
            );
          }}
        />
        <Controller
          control={form.control}
          name="bio"
          render={({ field, fieldState }) => {
            return (
              <Field className="w-full h-full">
                <FieldLabel className="paragraph-semibold text-dark400_light800">
                  Bio<span className="text-primary-500">*</span>
                </FieldLabel>
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

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;

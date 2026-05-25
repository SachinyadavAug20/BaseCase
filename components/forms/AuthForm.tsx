"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ROUTES from "@/constant/routes";
import { ActionResponse } from "@/types/global";
import { useRouter } from "next/navigation";

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formtype: "SIGN_IN" | "SIGN_UP";
}

const AuthFormOfUsername = <T extends FieldValues>({
  schema,
  formtype,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;
    if (result?.success) {
      toast.success("Success", {
        description:
          formtype === "SIGN_IN"
            ? "Sign in successfully"
            : "Sign up successfully",
        duration: 3000,
      });
      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };
  const buttonText = formtype === "SIGN_IN" ? "Sign In" : "Sign up";
  const buttonClass =
    "primary-gradient paragraph-medium min-h-12 w-1/2 rounded-2 px-4 py-3 font-inter cursor-pointer !text-light-900";

  return (
    <div className="flex items-center justify-center m-2 background-light800_dark200!">
      <Card className="w-full sm:max-w-md px-5 py-5">
        <form id="form-rhf-input" onSubmit={form.handleSubmit(handleSubmit)}>
          {Object.keys(defaultValues).map((field) => (
            <FieldGroup key={field}>
              <Controller
                name={field as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-username">
                      {field.name === "email"
                        ? "Email Address"
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-username"
                      aria-invalid={fieldState.invalid}
                      required
                      type={field.name === "password" ? "password" : "text"}
                      autoComplete={field.name}
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 rounded-1.5 border"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          ))}
        </form>
        <div className="w-full flex justify-center items-center">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className={buttonClass}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="form-rhf-input"
              disabled={form.formState.isSubmitting}
              className={buttonClass}
            >
              {form.formState.isSubmitted
                ? buttonText === "Sign In"
                  ? "Signing In..."
                  : "Signing Up..."
                : buttonText}
            </Button>
          </Field>
        </div>
        {formtype === "SIGN_IN" ? (
          <p>
            Don{"'"}t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign In
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
};

export default AuthFormOfUsername;

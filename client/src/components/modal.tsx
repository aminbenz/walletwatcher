import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import clsx from "clsx";

export default function Modal({
  title,
  description,
  fields,
  schema,
  defaultValues,
  method = "POST",
  endpoint,
  redirect,
  split,
  as = "dialog",
  id,
  modalState,
  setModalState,
  openText,
  openComponent,
  submitText,
}: any) {
  const [isOpen, setOpen] = useState(modalState);
  // const router = useRouter();
  const navigate = useNavigate();
  const form = useForm({
    resolver: schema && zodResolver(schema),
    defaultValues:
      method == "PATCH" && id
        ? async () =>
            await api.get(endpoint + id).then((res) => res.data.result)
        : defaultValues,
  });

  const { isSubmitting } = form.formState;

  const close = () => {
    setOpen(false);
  };

  const open = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (typeof modalState == "boolean") {
      if (typeof setModalState == "function") {
        setOpen(modalState);
      } else {
        throw new Error("Please provider 'setModalState' function");
      }
    }
  }, [modalState]);

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      let message = "Submit!";
      if (endpoint) {
        const response = await api[method.toLowerCase()](
          id ? endpoint + id : endpoint,
          data
        );
        message = response.data?.message || "Request successful!";
        // redirect && navigate(redirect);
      }
      toast({
        title: message,
      });
      close();
      navigate(0);
    } catch (error: any) {
      const error_message =
        error?.response?.data?.message || "Something went wrong!";
      toast({
        title: error_message,
        variant: "destructive",
      });
    }
  };

  if (as == "form") {
    return (
      <Form {...form}>
        <form method={as} onSubmit={form.handleSubmit(onSubmit)}>
          <article className={` grid grid-cols-${split} gap-4`}>
            {fields?.map(
              ({
                name,
                label,
                type,
                options,
                placeholder,
                description,
                default: defaultValue,
                disabled,
                layout,
                ...reset
              }: any) => {
                return (
                  <FormField
                    key={name}
                    name={name}
                    control={form.control}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    render={({ field }) => (
                      <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        {type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={defaultValue}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {options.map((opt: any, i: number) => (
                                <SelectItem key={i} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : type === "radio" ? (
                          <FormItem className="space-y-3">
                            <FormLabel>{placeholder}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className={clsx("flex flex-col space-y-1", {
                                  "flex-row": layout == "row",
                                  "flex-col": layout == "column" || !layout,
                                })}
                              >
                                {options?.map(
                                  (opt: { value: string; label: string }) => {
                                    return (
                                      <FormItem
                                        key={opt.value}
                                        className="flex items-center space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <RadioGroupItem value={opt.value} />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {opt.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }
                                )}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        ) : type === "textarea" ? (
                          <FormControl>
                            <Textarea placeholder={placeholder} {...field} />
                          </FormControl>
                        ) : (
                          <FormControl>
                            <Input
                              placeholder={placeholder}
                              type={type}
                              {...field}
                              {...reset}
                            />
                          </FormControl>
                        )}
                        <FormDescription>{description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
            )}
          </article>
          <footer
            className={`mt-4 flex ${
              as === "form" ? "justify-start" : "justify-end"
            } gap-2 self-end`}
          >
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {submitText || method == "PATCH" ? "Edit" : "Submit"}
            </Button>
          </footer>
        </form>
      </Form>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setModalState}>
      {openComponent ? (
        <DialogTrigger asChild>
          {openComponent}
          {/* <Button variant="outline">{openComponent}</Button> */}
        </DialogTrigger>
      ) : typeof setModalState === "undefined" ? (
        <DialogTrigger asChild>
          <Button variant="outline">{openText || title || "Open"}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method={as} onSubmit={form.handleSubmit(onSubmit)}>
            <article className={`grid grid-cols-${split} gap-4`}>
              {fields?.map(
                ({
                  name,
                  label,
                  type,
                  options,
                  placeholder,
                  description,
                  default: defaultValue,
                  disabled,
                  layout,
                  ...reset
                }: any) => {
                  return (
                    <FormField
                      key={name}
                      name={name}
                      control={form.control}
                      defaultValue={defaultValue}
                      disabled={disabled}
                      render={({ field }) => (
                        <FormItem>
                          {label && <FormLabel>{label}</FormLabel>}
                          {type === "select" ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={defaultValue}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {options.map((opt: any, i: number) => (
                                  <SelectItem key={i} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : type === "radio" ? (
                            <FormItem className="space-y-3">
                              <FormLabel>{placeholder}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className={clsx("flex flex-col space-y-1", {
                                    "flex-row": layout == "row",
                                    "flex-col": layout == "column" || !layout,
                                  })}
                                >
                                  {options?.map(
                                    (opt: { value: string; label: string }) => {
                                      return (
                                        <FormItem
                                          key={opt.value}
                                          className="flex items-center space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <RadioGroupItem value={opt.value} />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {opt.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }
                                  )}
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          ) : type === "textarea" ? (
                            <FormControl>
                              <Textarea placeholder={placeholder} {...field} />
                            </FormControl>
                          ) : (
                            <FormControl>
                              <Input
                                placeholder={placeholder}
                                type={type}
                                {...field}
                                {...reset}
                              />
                            </FormControl>
                          )}
                          <FormDescription>{description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }
              )}
            </article>
            <footer
              className={`mt-4 flex ${
                as === "form" ? "justify-start" : "justify-end"
              } gap-2 self-end`}
            >
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant="secondary"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {submitText || method == "PATCH" ? "Edit" : "Submit"}
              </Button>
            </footer>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

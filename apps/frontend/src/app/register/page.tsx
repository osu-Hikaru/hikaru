"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { register, login } from "@/services/authService";

export default function PageRegister() {
  const { toast } = useToast();
  const formSchema = z.object({
    username: z.string().min(3).max(16),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((data: z.infer<typeof formSchema>) => {
    register(data.username, data.email, data.password).then(
      (responseToastRegistration) => {
        toast(responseToastRegistration);

        if (responseToastRegistration.variant !== "destructive") {
          login(data.username, data.password).then((responseToastLogin) => {
            toast(responseToastLogin);

            if (responseToastLogin.variant !== "destructive") {
              setTimeout(() => {
                window.location.href = "/";
              }, 3000);
            }
          });
        }
      }
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5 w-full max-w-md mx-auto">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full max-w-md mx-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
}

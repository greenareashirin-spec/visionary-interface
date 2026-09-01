import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Employee = {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: string;
  has_contract: boolean;
  created_at: string;
};

export type EmployeeInput = {
  name: string;
  position: string;
  phone: string;
  email: string;
  status: string;
};

async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Employee[];
}

export function useEmployees(): Employee[] {
  const [rows, setRows] = useState<Employee[]>([]);

  useEffect(() => {
    let active = true;
    fetchEmployees()
      .then((list) => {
        if (active) setRows(list);
      })
      .catch(() => {
        /* surfaced by mutations instead */
      });

    const channel = supabase
      .channel("employees-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => {
          fetchEmployees()
            .then((list) => {
              if (active) setRows(list);
            })
            .catch(() => {});
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return rows;
}

export async function addEmployee(input: EmployeeInput): Promise<Employee> {
  const name = input.name.trim();
  const position = input.position.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const status = input.status.trim();

  if (!name) throw new Error("Name is required.");
  if (!position) throw new Error("Position is required.");
  if (!status) throw new Error("Status is required.");
  if (!phone && !email) throw new Error("Add a phone number or email so this person can be reached.");

  const { data, error } = await supabase
    .from("employees")
    .insert({ name, position, phone, email, status })
    .select()
    .single();

  if (error) throw new Error(error.message || "Could not save this employee.");
  return data as Employee;
}

export async function removeEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateEmployee(
  id: string,
  patch: Partial<Pick<Employee, "name" | "position" | "phone" | "email" | "status" | "has_contract">>,
) {
  const { error } = await supabase.from("employees").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

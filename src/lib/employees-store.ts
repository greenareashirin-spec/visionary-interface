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

export const CONTRACT_MAX_BYTES = 10 * 1024 * 1024;
export const CONTRACT_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const CONTRACT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export function validateContractFile(file: File): string | null {
  if (file.size > CONTRACT_MAX_BYTES) return "File is larger than 10MB.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ["pdf", "doc", "docx", "jpg", "jpeg", "png"].includes(ext);
  if (!CONTRACT_TYPES.includes(file.type) && !okExt) return "Unsupported file type.";
  return null;
}

export async function uploadContract(employeeId: string, file: File): Promise<void> {
  const invalid = validateContractFile(file);
  if (invalid) throw new Error(invalid);

  const { error } = await supabase.storage
    .from("contracts")
    .upload(`${employeeId}/${file.name}`, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw new Error(error.message || "Could not upload this contract.");
  await updateEmployee(employeeId, { has_contract: true });
}

export async function getContractUrl(employeeId: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("contracts")
    .list(employeeId, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  const latest = data?.[0];
  if (!latest) return null;

  const signed = await supabase.storage
    .from("contracts")
    .createSignedUrl(`${employeeId}/${latest.name}`, 60);
  if (signed.error) throw new Error(signed.error.message);
  return signed.data?.signedUrl ?? null;
}

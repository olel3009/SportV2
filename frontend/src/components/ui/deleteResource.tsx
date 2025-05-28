"use client";

import { deleteAthlete, deleteFeat } from "@/athlete_getters";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const handleClick = async (
  ids: number[] | (() => number[]),
  type: "athlete" | "result",
  onDelete: () => void,
  redirect: string,
  router: AppRouterInstance
) => {
  const resolvedIds = Array.isArray(ids) ? ids : ids();
  try {
    let ok;
    if (type === "athlete") ok = await deleteAthlete(resolvedIds);
    if (type === "result") ok = await deleteFeat(resolvedIds);
    if (!ok) console.warn("Download failed");
  } catch (e) {
    console.error("Resource deletion threw:", e);
  }
  if (onDelete) onDelete();
  if (redirect !== "") router.push(redirect);
};

interface DeleteResourceProps {
  type: "athlete" | "result";
  ids: number[] | (() => number[]);
  text?: string;
  warning?: string;
  redirect?: string;
  onDelete?: () => void;
}

export default function DeleteResource({
  type,
  ids,
  text = "",
  warning = "",
  onDelete,
  redirect = "",
}: DeleteResourceProps) {
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger className="flex gap-1 text-destructive" asChild>
        <Button className="flex gap-1 text-destructive" variant="link">
          <Trash2 /> <span>{text}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <span>{warning}</span>
          <span className="text-neutral-500 text-sm">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </span>
          <PopoverClose
            onClick={() =>
              handleClick(ids, type, onDelete || (() => {}), redirect, router)
            }
            asChild
          >
            <Button variant="destructive">Löschen</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DeleteResourceButton({
  type,
  ids,
  text = "",
  warning = "",
  onDelete,
  redirect = "",
}: DeleteResourceProps) {
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger className="flex gap-1 flex-grow" asChild>
        <Button variant="destructive">
          <Trash2 /> <span>{text}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <span>{warning}</span>
          <span className="text-neutral-500 text-sm">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </span>
          <PopoverClose
            onClick={() =>
              handleClick(ids, type, onDelete || (() => {}), redirect, router)
            }
            asChild
          >
            <Button variant="destructive">Löschen</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
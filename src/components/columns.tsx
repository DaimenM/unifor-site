import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, ArrowUpDown, Archive } from "lucide-react"
import { Article } from "@/types/article"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type ColumnsProps = {
  onDeleteClick: (article: Article) => void;
  onEditClick: (article: Article) => void;
  onArchiveClick: (article: Article) => void;
}

export const columns = ({ onDeleteClick, onEditClick, onArchiveClick }: ColumnsProps): ColumnDef<Article>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link 
            href={`/article/${row.original.id}`}
            className="hover:underline text-foreground"
          >
            {row.original.title}
          </Link>
          {row.original.archived?.isArchived && (
            <Badge variant="secondary" className="flex items-center gap-1 cursor-help" title={`Archived on ${format(new Date(row.original.archived.date), "PPp")}\nReason: ${row.original.archived.reason}`}>
              <Archive className="h-3 w-3" />
              Archived
            </Badge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content: string = row.getValue("content")
      return <div>{content.slice(0, 20)}...</div>
    },
  },
  {
    accessorKey: "date",
    header: "Created At",
    cell: ({ row }) => {
      return format(new Date(row.original.date), "PPp")
    },
  },
  {
    id: "lastEdited",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Edited
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastEdited = row.original.lastEdited || row.original.date
      return format(new Date(lastEdited), "PPp")
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.lastEdited || rowA.original.date).getTime()
      const dateB = new Date(rowB.original.lastEdited || rowB.original.date).getTime()
      return dateA - dateB
    }
  },
  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => {
      const hasAttachments = 
        (row.original.images?.length ?? 0) > 0 || 
        (row.original.files?.length ?? 0) > 0
      return <Checkbox checked={hasAttachments} disabled />
    },
  },
  {
    id: "desktopViews",
    header: "Desktop Views",
    cell: ({ row }) => {
      const visitors = row.original.visitors || []
      return visitors.filter(v => v.platform.toLowerCase() === 'desktop').length
    },
  },
  {
    id: "mobileViews",
    header: "Mobile Views",
    cell: ({ row }) => {
      const visitors = row.original.visitors || []
      return visitors.filter(v => v.platform.toLowerCase() === 'mobile').length
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEditClick(article)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onArchiveClick(article)}>
              {article.archived?.isArchived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(article)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
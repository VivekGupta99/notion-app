"use client"

import Editor from "@/components/Editor"
import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import { Toolbar } from "@/components/Toolbar"
import { Cover } from "@/components/cover"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Edior = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  )

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  const update = useMutation(api.documents.update)

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className=" md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not Found</div>
  }

  return (
    <div className=" pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage

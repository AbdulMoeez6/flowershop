import React from "react"
import Image, { ImageProps } from "next/image"
import { CldImage, CldImageProps } from "next-cloudinary"

type CloudImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined
}

export function CloudImage({ src, ...props }: CloudImageProps) {
  if (!src) {
    return <div className={`bg-muted ${props.className || ''}`} />
  }

  const hasCloudinaryEnv = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
  const isCloudinary = hasCloudinaryEnv && typeof src === "string" && src.includes("res.cloudinary.com")

  if (isCloudinary) {
    // CldImage supports all next/image props, but we need to ensure type compatibility
    return <CldImage src={src} {...(props as any)} />
  }

  return <Image src={src} {...props} />
}

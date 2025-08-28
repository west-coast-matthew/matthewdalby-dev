"use client";

import React, { useState, ReactNode } from "react";
import Modal from "../Modal"; // Your Modal component from the previous example
import ImageReference from "@/components/ImageReference";

// Define props for type safety, allowing children to be passed to the modal
interface ClientModalWrapperProps {
  title?: string;
  subTitle?: string;
  imgRef: string;
  imgDesc: string;
  children: ReactNode;
}

export default function ClientModalWrapper({
  title,
  subTitle,
  imgRef,
  imgDesc,
  children,
}: ClientModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={handleOpenModal}>
        <ImageReference imgRef={imgRef} description={imgDesc} />
      </div>

      <Modal
        title={title}
        subTitle={subTitle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {children}
      </Modal>
    </>
  );
}

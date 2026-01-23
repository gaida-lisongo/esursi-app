"use client";

import { useState } from "react";
import ProgrammeSelectionStep from "./ProgrammeSelectionStep";
import InscriptionConfigStep from "./InscriptionConfigStep";

interface CreateInscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  etabId: string;
  anneeId: string;
}

export default function CreateInscriptionModal({
  isOpen,
  onClose,
  onSuccess,
  etabId,
  anneeId
}: CreateInscriptionModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedProgramme, setSelectedProgramme] = useState<any>(null);

  const handleProgrammeSelected = (programme: any) => {
    setSelectedProgramme(programme);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
    setSelectedProgramme(null);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedProgramme(null);
    onClose();
  };

  const handleSuccess = () => {
    setCurrentStep(1);
    setSelectedProgramme(null);
    onSuccess();
  };

  if (!isOpen) return null;

  if (currentStep === 1) {
    return (
      <ProgrammeSelectionStep
        onNext={handleProgrammeSelected}
        onClose={handleClose}
        etabId={etabId}
      />
    );
  }

  return (
    <InscriptionConfigStep
      onBack={handleBack}
      onClose={handleClose}
      onSuccess={handleSuccess}
      selectedProgramme={selectedProgramme}
      etabId={etabId}
      anneeId={anneeId}
    />
  );
}
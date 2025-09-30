// NO LONGER IN USE / DEPRECATED
export interface Instruction {
  id: string;
  text: string;
  emoji?: string;
  imageUrl?: string;
  usage?: string;
}

export interface DigitalInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInstructions?: Instruction[];
  onSave?: (instructions: Instruction[]) => void;
}

export interface InstructionFormProps {
  onAddInstruction: (instruction: Omit<Instruction, 'id'>) => void;
}

export interface InstructionListProps {
  instructions: Instruction[];
  onEditInstruction: (id: string, newText: string, newEmoji?: string, newImageUrl?: string) => void;
  onDeleteInstruction: (id: string) => void;
}

export interface InstructionStepItemProps {
  instruction: Instruction;
  index: number;
  onEdit: (id: string, newText: string, newEmoji?: string, newImageUrl?: string) => void;
  onDelete: (id: string) => void;
}

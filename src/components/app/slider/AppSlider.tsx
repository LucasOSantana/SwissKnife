import { FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

type sliderType = {
  value: number[];
  onValueChange: (newValue: number[]) => void;
  max: number;
  min: number;
  step: number;
  label: string;
}

export function AppSlider({value, onValueChange, max, min, step, label}: sliderType) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <Slider
        value={value}
        onValueChange={onValueChange}
        max={max}
        min={min}
        step={step}
        className="mx-auto w-full"
      />
    </>
  )
}

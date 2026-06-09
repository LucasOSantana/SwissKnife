import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function AppInputGroup({
    placeholder, 
    icon,
    value,
    onChange
  }: { 
    placeholder: string; 
    icon: React.ReactNode; 
    value: string; 
    onChange: (value: string) => void; 
  }) {
  return (
      <InputGroup>
        <InputGroupInput 
          id="input-group-url" 
          placeholder={placeholder} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <InputGroupAddon align="inline-end">
          {icon}
        </InputGroupAddon>
      </InputGroup>
  )
}

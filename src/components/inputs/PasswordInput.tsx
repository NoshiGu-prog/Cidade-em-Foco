import { Eye, EyeClosed } from "lucide-react-native";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { InputText, type InputTextProps } from "./TextInput";

export const InputPassword = (props: InputTextProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputText
      {...props}
      secureTextEntry={!showPassword}
      right={
        <TextInput.Icon
          icon={({ color, size }) =>
            showPassword ? (
              <EyeClosed color={color} size={size} />
            ) : (
              <Eye color={color} size={size} />
            )
          }
          onPress={() => setShowPassword((prev) => !prev)}
        />
      }
    />
  );
};

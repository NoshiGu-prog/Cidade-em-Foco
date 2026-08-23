import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Checkbox, CheckboxProps } from "react-native-paper";
import { colors } from "../../theme/theme";

type InputCheckboxProps = Omit<CheckboxProps, "status" | "onPress"> & {
  name: string;
  label?: string;
};

export const InputCheckbox = ({
  name,
  label,
  ...props
}: InputCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            {...props}
            status={field.value ? "checked" : "unchecked"}
            onPress={() => field.onChange(!field.value)}
            color={props.color ?? colors.brandBlue}
            uncheckedColor={props.uncheckedColor ?? colors.brandBlue}
          />

          {label && (
            <Text
              style={{
                color: colors.checkboxFontColor,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {label}
            </Text>
          )}
          {fieldState.error?.message && (
            <Text style={{ color: "#ba1a1a" }}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

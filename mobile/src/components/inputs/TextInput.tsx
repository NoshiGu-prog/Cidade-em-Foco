import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import { colors } from "../../theme/theme";

export type InputTextProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onBlur"
> & {
  name: string;
};

export const InputText = (props: InputTextProps) => {
  const { control } = useFormContext();
  const { name, ...textInputProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View>
          <TextInput
            {...textInputProps}
            value={field.value ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={!!fieldState.error}
            style={[
              {
                ...props.style,
                backgroundColor: colors.inputBackground,
                borderRadius: 14,
                color: colors.brandBlue,
                textDecorationColor: colors.brandBlue,
                borderBlockColor: colors.brandBlue,
                borderColor: colors.brandBlue,
                borderWidth: 0.1,
                fontWeight: "bold",
                fontSize: 16,
              },
              props.style,
            ]}
            underlineStyle={{ display: "none" }}
          />
          <HelperText type="error" visible={!!fieldState.error?.message}>
            {fieldState.error?.message}
          </HelperText>
        </View>
      )}
    />
  );
};

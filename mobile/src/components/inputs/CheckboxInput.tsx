import { Controller, useFormContext } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { CheckboxProps, HelperText } from "react-native-paper";
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
      render={({ field, fieldState }) => {
        const checked = !!field.value;

        return (
          <View>
            <Pressable
              onPress={() => field.onChange(!checked)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                paddingVertical: 4,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: fieldState.error ? "red" : colors.brandBlue,
                  backgroundColor: checked ? colors.brandBlue : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {checked && (
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      fontWeight: "bold",
                      lineHeight: 20,
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>

              {label && (
                <Text
                  style={{
                    marginLeft: 10,
                    color: colors.checkboxFontColor,
                    fontSize: 16,
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {label}
                </Text>
              )}
            </Pressable>

            {fieldState.error?.message && (
              <HelperText
                type="error"
                style={{
                  marginTop: -2,
                  marginLeft: 24,
                }}
              >
                {fieldState.error.message}
              </HelperText>
            )}
          </View>
        );
      }}
    />
  );
};

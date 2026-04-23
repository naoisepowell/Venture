import { fireEvent, render } from "@testing-library/react-native";
import { FormField } from "@/src/components/FormField";

describe("Component: FormField", () => {
  // Checks the label and placeholder are visible when rendered
  it("renders the label and placeholder text", () => {
    const { getByText, getByPlaceholderText } = render(
      <FormField
        label="Trip title"
        placeholder="Enter a title"
        value=""
        onChangeText={jest.fn()}
      />
    );

    expect(getByText("Trip title")).toBeTruthy();
    expect(getByPlaceholderText("Enter a title")).toBeTruthy();
  });

  // Simulates typing and checks the callback fires with the right value
  it("fires onChangeText with the typed value", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <FormField
        label="Trip title"
        placeholder="Enter a title"
        value=""
        onChangeText={onChangeText}
      />
    );

    fireEvent.changeText(getByPlaceholderText("Enter a title"), "Southeast Asia");

    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith("Southeast Asia");
  });
});

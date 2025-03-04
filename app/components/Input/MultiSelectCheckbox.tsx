import {
  Checkbox,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox
} from '@mantine/core';

export function MultiSelectCheckbox({
  form,
  label,
  name,
  data
}: {
  form: any;
  label: string;
  name: string;
  data: { label: string; value: any }[];
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active')
  });

  const items = form.values[name];

  const handleValueSelect = (val: number) => {
    form.setFieldValue(
      name,
      items.includes(val) ? items.filter((v) => v !== val) : [...items, val]
    );
  };

  const handleValueRemove = (val: number) => {
    form.setFieldValue(
      name,
      items.filter((v) => v !== val)
    );
  };

  const values = form.values?.[name]?.map((item: number) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {data.find((i) => i.value === item)?.label}
    </Pill>
  ));

  const options = data.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      active={items.includes(item.value)}
    >
      <Group gap="sm">
        <Checkbox
          checked={items.includes(item.value)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        />
        <span>{item.label}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            label={label}
            pointer
            onClick={() => combobox.toggleDropdown()}
          >
            <Pill.Group>
              {values.length > 0 ? (
                values
              ) : (
                <Input.Placeholder>Pick one or more values</Input.Placeholder>
              )}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  type="hidden"
                  onBlur={() => combobox.closeDropdown()}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace') {
                      event.preventDefault();
                      handleValueRemove(items[items.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>
        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(form.values?.[name])}
      />
    </>
  );
}

/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useActionData, useNavigate, useSubmit } from 'react-router';
import classes from './Login.module.css';
import { validateLogin } from '~/types/User';

export function Login() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: actionData?.data ?? {
      email: '',
      password: ''
    },
    validate: validateLogin
  });

  if (actionData?.errors && !(Object.keys(form?.errors).length > 0)) {
    form.setErrors(actionData.errors);
  }

  return (
    <Container size={420}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor
          component="button"
          onClick={() => navigate('/register')}
          size="sm"
        >
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form
          method="POST"
          onSubmit={form.onSubmit((_v, e) => {
            if (actionData?.errors) {
              delete actionData?.errors;
              form.clearErrors();
            }
            submit(e.currentTarget);
          })}
        >
          <TextInput
            required
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter email"
            data-autofocus
            {...form.getInputProps('email')}
          />
          <PasswordInput
            required
            label="Password"
            name="password"
            placeholder="Password"
            {...form.getInputProps('password')}
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Form>
        <Group justify="space-between" mt="lg">
          <Anchor
            component="button"
            onClick={() => navigate('/user/reset')}
            size="sm"
          >
            Forgot password?
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
}

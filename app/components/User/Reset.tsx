/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit
} from 'react-router';
import classes from './Reset.module.css';
import { validateResetRequest, validateReset } from '~/types/User';

export function UserReset() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const { reset } = useLoaderData();
  const [searchParams] = useSearchParams();
  const resetRequired = searchParams.get('required');
  const submit = useSubmit();

  const formRequest = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: actionData?.data ?? {
      email: ''
    },
    validate: validateResetRequest
  });

  if (
    actionData?.request?.errors &&
    !(Object.keys(formRequest?.errors).length > 0)
  ) {
    formRequest.setErrors(actionData.request.errors);
  }

  const formReset = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: actionData?.data ?? {
      email: reset?.email ?? '',
      resetKey: reset?.resetKey ?? '',
      password: ''
    },
    validate: validateReset
  });

  if (
    actionData?.reset.errors &&
    !(Object.keys(formReset?.errors).length > 0)
  ) {
    formReset.setErrors(actionData.reset.errors);
  }

  return (
    <Container size={420}>
      {!resetRequired ? (
        <>
          <Title ta="center" className={classes.title}>
            Reset Password
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
        </>
      ) : (
        <>
          <Title order={2} ta="center" className={classes.title}>
            Password Reset Required
          </Title>
          <Alert
            variant="outline"
            title="Security Update"
            icon={<IconInfoCircle />}
            mt="lg"
          >
            Please enter your email address and we will send you a link to reset
            your password.
          </Alert>
        </>
      )}
      <Paper withBorder shadow="md" p={30} my={30} radius="md">
        <Form
          method="POST"
          onSubmit={formRequest.onSubmit((_v, e: any) => {
            if (actionData?.errors) {
              delete actionData?.errors;
              formRequest.clearErrors();
            }
            submit(e.currentTarget);
          })}
        >
          <TextInput
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter email"
            {...formRequest.getInputProps('email')}
            required
          />
          <input type="hidden" name="requestReset" value="true" />
          <Button fullWidth mt="md" type="submit">
            Send Reset Link
          </Button>
        </Form>
      </Paper>
      {!resetRequired && (
        <>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Just need to{' '}
            <Anchor
              component="button"
              onClick={() => navigate('/login')}
              size="sm"
            >
              Login
            </Anchor>
            ?
          </Text>
          <Paper withBorder shadow="md" p={30} my={30} radius="md">
            <Form
              method="POST"
              onSubmit={formReset.onSubmit((_v, e: any) => {
                if (actionData?.errors) {
                  delete actionData?.errors;
                  formReset.clearErrors();
                }
                submit(e.currentTarget);
              })}
            >
              <TextInput
                label="Email address"
                type="email"
                name="email"
                placeholder="Enter email"
                {...formReset.getInputProps('email')}
                required
              />
              <TextInput
                label="Reset Code"
                type="text"
                name="resetKey"
                placeholder="Enter reset code"
                {...formReset.getInputProps('resetKey')}
                mt="md"
                required
              />
              <PasswordInput
                label="New Password"
                name="password"
                placeholder="Your new password"
                {...formReset.getInputProps('password')}
                mt="md"
                required
              />
              <Button fullWidth mt="md" type="submit">
                Reset Password
              </Button>
            </Form>
          </Paper>
        </>
      )}
    </Container>
  );
}

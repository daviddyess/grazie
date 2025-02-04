/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import nodemailer from 'nodemailer';
import { mail } from '~/utils/config.server';
import { getLogger } from '~/utils/logger.server';
import { site } from '@/grazie';

const log = getLogger('Mailer Module');

/**
 * Generate sendMail() options for Support emails
 * @param {options} param0
 * @returns object
 */
export const support = ({
  subject = `Contact from BeSquishy`,
  user = 'Anonymous',
  email,
  ip = 'unknown',
  message
}) => {
  if (!email || !message) {
    throw new Error('Mailer error: email, and message are required fields');
  }
  return {
    from: mail.noReply,
    to: mail.support,
    replyTo: email,
    subject,
    html: `
      <p><b>User:</b> ${user}</p>
      <b>Subject:</b> ${subject}
      <p><b>Message:</b></p>
      ${message}
      <p><b>Email:</b> ${email}</p>
      <b>IP:</b> ${ip}
    `
  };
};

/**
 * Generate sendMail() options for User Activation emails
 * @param {options} param0
 * @returns
 */
export const userActivation = ({
  subject = `Activate Your BeSquishy Account`,
  id,
  username,
  email,
  url = 'https://besquishy.com/user/activate',
  confirmKey
}) => {
  if (!username || !email || !id) {
    throw new Error(
      'Mailer error: user, email, and message are required fields'
    );
  }
  return {
    from: mail.noReply,
    to: email,
    subject,
    html: `
      <p><b>User:</b> ${username}</p>
      <p><b>Welcome to BeSquishy! Please use the code below to activate your account!</b></p>
      <b>Activation Key:</b> ${confirmKey}
      <p><a href="${url}/${confirmKey}">Click here to activate</a><p>
    `
  };
};

/**
 * Generate sendMail() options for User Welcome emails
 * @param {options} param0
 * @returns
 */
export const userWelcome = ({
  subject = `Welcome to BeSquishy`,
  username,
  email,
  url = 'https://besquishy.com'
}) => {
  if (!username || !email) {
    throw new Error(
      'Mailer error: user, email, and message are required fields'
    );
  }
  return {
    from: mail.noReply,
    to: email,
    subject,
    html: `
      <p><b>User:</b> ${username}</p>
      <p><b>Welcome to BeSquishy! Thank you for confirming your email!</b></p>
      <p><a href="${url}">Click here to login</a><p>
    `
  };
};

/**
 * Generate sendMail() options for User Password Reset emails
 * @param {options} param0
 * @returns
 */
export const userResetRequest = ({
  subject = `Reset Your ${site.name} Account`,
  id,
  username,
  email,
  url = `${site.url}/user/reset`,
  resetKey
}) => {
  if (!username || !email || !id) {
    throw new Error(
      'Mailer error: user, email, and message are required fields'
    );
  }
  return {
    from: mail.noReply,
    to: email,
    subject,
    html: `
      <p><b>User:</b> ${username}</p>
      <p><b>Need to reset your ${
        site.name
      } password? No problem! Please use the link below to continue.</b></p>
      <p><a href="${url}?id=${btoa(
      JSON.stringify([email, resetKey])
    )}">Click here to reset your password</a><p>
    <p>Reset Code: ${resetKey}</p>
    `
  };
};

/**
 * sendMail
 * @param {options} options
 * @returns
 */
export async function sendMail(options) {
  log.info('Sending Email...');
  const transport = nodemailer.createTransport(mail.smtp);

  await transport.sendMail(options, (err, info) => {
    if (err) {
      log.error(err);
    } else {
      log.info(`Email sent: ${info?.response}`);
    }
  });
}

export default {
  support,
  sendMail,
  userActivation,
  userResetRequest,
  userWelcome
};

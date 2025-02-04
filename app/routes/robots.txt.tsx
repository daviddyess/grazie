export const loader = () => {
  const txt = `User-agent: *
Allow: /`;

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

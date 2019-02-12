exports.render = data => (
    'Hello,<br/><br/>' +
    `We saw you signed up! Please confirm your email by clicking here ${data.link}.<br/><br/>` +
    'Thanks,<br/>' +
    `- The ${data.project} Team`
);

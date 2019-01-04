import nextRoutes from 'next-routes';

const pages = nextRoutes();

pages
  .add('faq')
  .add('contribute')
  .add('group', '/:groupSlug')
  .add('post', '/:groupSlug/:postSlug')
  .add('index', '/');

export default pages;

export const { Link, Router } = pages;

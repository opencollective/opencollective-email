import React from 'react';
import Document from './home.mdx';
import { Button } from 'semantic-ui-react';
import settings from '../../settings.json';
import { get } from 'lodash';

const H1 = props => <h1 style={{ color: '#222' }} {...props} />;
const H2 = props => <h2 style={{ fontWeight: 300 }} {...props} />;
const InlineCode = props => <code id="codes" style={{ color: 'purple' }} {...props} />;
const Code = props => <code id="codes" style={{ fontWeight: 600 }} {...props} />;
const Pre = props => <pre id="codes" style={{ color: 'red' }} {...props} />;

export default () => (
  <div className="home">
    <style jsx>{`
      .toplinks {
        margin: 0 auto;
        text-align: center;
      }
      .toplinks li {
        display: inline;
        padding: 0 0.5rem;
      }
      .buttons {
        margin: 2rem 0;
      }
      .home :global(.ui.green.button) {
        margin: 0.5rem 0.5rem 0.5rem 0;
        min-width: 20rem;
        font-size: 1.5rem;
      }
      @media (max-width: 600px) {
        .home :global(.ui.green.button) {
          width: 100%;
        }
      }
    `}</style>
    <ul className="toplinks">
      {get(settings, 'home.toplinks', []).map(link => (
        <li>
          <a href={link.url}>{link.label}</a>
        </li>
      ))}
    </ul>
    <H1>{settings.title}</H1>
    <H2>{settings.description}</H2>
    <Document
      components={{
        h1: H1,
        pre: Pre,
        code: Code,
        inlineCode: InlineCode,
      }}
    />
    <div className="buttons">
      {get(settings, 'home.buttons', []).map(button => (
        <Button color="green" inverted onClick={() => (window.location.href = button.href)}>
          {button.label}
        </Button>
      ))}
    </div>
  </div>
);

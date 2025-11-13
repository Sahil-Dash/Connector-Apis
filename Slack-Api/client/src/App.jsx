// import { Zap, Bot } from 'lucide-react';
// import './App.css';

// const App = () => {
//   return (
//     <div className="app-container">
//       <div className="card">
//         <h1 className="title">
//           <Zap className="icon" />
//           <span>Connectors & APIs</span>
//         </h1>

//         <p className="subtitle">
//           Connect your account to external services easily.
//         </p>

//         <a
//           href="https://slack.com/oauth/v2/authorize?client_id=9902986678389.9910144872468&scope=chat:write,users:read,channels:read,im:write&redirect_uri=https://9614f8d6cd6daf.lhr.life/api/slack/oauth/callback"
//           className="slack-link"
//         >
//           <button className="slack-button" aria-label="Add to Slack">
//             <Bot className="bot-icon" />
//             Add to Slack
//           </button>
//         </a>

//         <p className="footer-text">
//           By clicking "Add to Slack", you begin the authorization process.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default App;

//-----------------------(no BOT scopes )------------------------------- 

import { Zap, Bot } from 'lucide-react';
import './App.css';

const App = () => {
  const userScopes = [  // USER scopes (not bot scopes)
    'channels:read',
    'channels:history',
    'groups:read',
    'groups:history',
    'im:read',
    'im:history',
    'chat:write',
    'users:read'
  ].join(',');

  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=9902986678389.9910144872468&scope=${userScopes}&redirect_uri=https://9614f8d6cd6daf.lhr.life/api/slack/oauth/callback&user_scope=${userScopes}`;

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">
          <Zap className="icon" />
          <span>Connectors & APIs</span>
        </h1>

        <p className="subtitle">
          Connect your account to external services easily.
        </p>

        <a href={authUrl} className="slack-link">
          <button className="slack-button" aria-label="Add to Slack">
            <Bot className="bot-icon" />
            Add to Slack
          </button>
        </a>

        <p className="footer-text">
          By clicking "Add to Slack", you begin the authorization process.
        </p>
      </div>
    </div>
  );
};

export default App;

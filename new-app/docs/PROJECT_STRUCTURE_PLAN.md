# Project Structure Plan

## Directory Structure
```
/scheduler/ (current legacy repo)
├── /new-app/
│   ├── devenv.nix
│   ├── .envrc
│   ├── package.json (workspace root)
│   ├── /backend/
│   │   ├── package.json
│   │   ├── src/
│   │   ├── prisma/
│   │   └── ...
│   └── /frontend/
│       ├── package.json  
│       ├── src/
│       └── ...
├── /specs/ (current - move to new-app/docs/)
├── /docs/ (current LLM-generated docs)
└── ... (legacy CakePHP files)
```

## Tech Stack
- **Frontend**: React + Vite → Deploy to Vercel
- **Backend**: Node.js + Express + Prisma → Deploy to Render
- **Database**: Render PostgreSQL (prod) + Local PostgreSQL (dev)
- **Local Development**: devenv + direnv

## devenv.nix Configuration
```nix
{ pkgs, ... }:

{
  cachix.enable = false;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    npm.enable = true;
  };

  languages.typescript.enable = true;

  packages = with pkgs; [ git ];

  dotenv.enable = true;

  services.postgres = {
    enable = true;
    listen_addresses = "*";
    initialDatabases = [
      {
        name = "scheduler";
        user = "scheduler_user";
        pass = "scheduler_password";
      }
    ];
    initialScript = ''
      ALTER USER scheduler_user CREATEDB;
    '';
  };

  env.DATABASE_URL = "postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler";

  scripts.setup.exec = ''
    echo "📦 Installing deps and generating Prisma client..."
    npm install
    npm run prisma -- generate
    npm run migrate
  '';

  enterShell = ''
    echo "👋  Welcome to Scheduler. Postgres is running. Use the aliases below:"
    echo ""
    echo "  ▶️  Run services:"
    echo "     $ npm run dev:backend   # backend API"
    echo "     $ npm run dev:frontend  # React frontend"
    echo "     $ npm run dev           # both simultaneously"
    echo ""
    echo "  📥 Database operations:"
    echo "     $ npm run prisma -- migrate dev"
    echo "     $ npm run prisma -- studio"
    echo ""
  '';
}
```

## .envrc Configuration
```bash
use devenv
```

## Next Steps
1. Create /new-app/ directory structure
2. Set up devenv.nix and .envrc
3. Initialize package.json files for monorepo
4. Move current specs to /new-app/docs/
5. Set up basic backend and frontend scaffolding
6. Create CLAUDE.md files for parallel development

## Deployment Plan
- **Frontend**: Vercel (automatic deploys from git)
- **Backend**: Render (with Render PostgreSQL database)
- **Environment**: Production env vars in Render dashboard
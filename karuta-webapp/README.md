# Karuta Webapp



## Technologies Used

- [Next.js 16](https://nextjs.org/docs/getting-started)
- [HeroUI v3](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

nvm use 22
npm install -g pnpm      # si pas encore installé
cp .env.example .env     # ou créer .env manuellement avec DATABASE_URL
pnpm install
pnpm prisma migrate dev
npm run dev

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup the DB

```bash
pnpm dlx prisma generate
pnpm dlx prisma migrate
```

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).

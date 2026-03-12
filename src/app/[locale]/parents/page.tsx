import GenericPage from '@/components/GenericPage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage slug="parents" locale={locale} />;
}

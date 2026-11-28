import AiSettingsForm from '@domain/profile-summary/components/AiSettingsForm';
import UserSettingsLayout from '@domain/user/components/UserSettingsLayout';

export default function UserAiSettings() {
  return (
    <UserSettingsLayout title="AI 설정" detail>
      <AiSettingsForm />
    </UserSettingsLayout>
  );
}

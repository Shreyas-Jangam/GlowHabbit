import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, AtSign, Globe, Calendar, Pencil, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { UserProfile } from '@/hooks/useProfile';

interface UserInfoCardProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

interface EditableFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: string;
  readonly?: boolean;
}

function EditableField({ icon: Icon, label, value, onSave, type = 'text', readonly = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-calm-mist/50">
        <Icon className="h-4 w-4 text-calm-mist-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">
              {value || <span className="text-muted-foreground italic">Not set</span>}
            </p>
            {!readonly && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      {!readonly && !isEditing && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export function UserInfoCard({ profile, onUpdate }: UserInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <EditableField
            icon={User}
            label="Name"
            value={profile.name}
            onSave={(value) => onUpdate({ name: value })}
          />
          <EditableField
            icon={Mail}
            label="Email"
            value={profile.email}
            type="email"
            onSave={(value) => onUpdate({ email: value })}
          />
          <EditableField
            icon={AtSign}
            label="Username"
            value={profile.username}
            onSave={(value) => onUpdate({ username: value })}
          />
          <EditableField
            icon={Globe}
            label="Timezone"
            value={profile.timezone}
            onSave={(value) => onUpdate({ timezone: value })}
          />
          <EditableField
            icon={Calendar}
            label="Joined"
            value={format(new Date(profile.joinedDate), 'MMMM d, yyyy')}
            onSave={() => {}}
            readonly
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

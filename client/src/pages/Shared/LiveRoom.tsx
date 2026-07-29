import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const LiveRoom: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);

  // Determine role for Jitsi (if teacher, they are moderator)
  const isModerator = user?.role === 'teacher';

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      {/* Custom Header when not joined or over Jitsi if needed */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 shrink-0 justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Leave Room</span>
        </button>
        <div className="text-white font-medium">Live Class: {roomId}</div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 w-full h-full relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomId || "LMS_Fallback_Room"}
          configOverwrite={{
            startWithAudioMuted: !isModerator,
            startWithVideoMuted: false,
            disableModeratorIndicator: false,
            enableEmailInStats: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
            ],
          }}
          userInfo={{
            displayName: user?.name || 'Guest',
            email: user?.email || '',
          }}
          onApiReady={(externalApi) => {
            setIsJoined(true);
            // externalApi.addListener('videoConferenceLeft', () => {
            //   navigate(-1);
            // });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
        
        {!isJoined && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p>Connecting to live class...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRoom;

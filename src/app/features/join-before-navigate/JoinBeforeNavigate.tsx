import React from 'react';
import { Box, Scroll, Text, toRem } from 'folds';
import { useAtomValue } from 'jotai';
import { RoomCard } from '../../components/room-card';
import { RoomTopicViewer } from '../../components/room-topic-viewer';
import { Page, PageHeader } from '../../components/page';
import { RoomSummaryLoader } from '../../components/RoomSummaryLoader';
import { useRoomNavigate } from '../../hooks/useRoomNavigate';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { allRoomsAtom } from '../../state/room-list/roomList';

type JoinBeforeNavigateProps = { roomIdOrAlias: string };
export function JoinBeforeNavigate({ roomIdOrAlias }: JoinBeforeNavigateProps) {
  const mx = useMatrixClient();
  const allRooms = useAtomValue(allRoomsAtom);
  const { navigateRoom, navigateSpace } = useRoomNavigate();

  const handleView = (roomId: string) => {
    if (mx.getRoom(roomId)?.isSpaceRoom()) {
      navigateSpace(roomId);
      return;
    }
    navigateRoom(roomId);
  };

  return (
    <Page>
      <PageHeader>
        <Box grow="Yes" justifyContent="Center" alignItems="Center" gap="200">
          <Text size="H3" truncate>
            {roomIdOrAlias}
          </Text>
        </Box>
      </PageHeader>
      <Box grow="Yes">
        <Scroll hideTrack visibility="Hover" size="0">
          <Box style={{ height: '100%' }} grow="Yes" alignItems="Center" justifyContent="Center">
            <RoomSummaryLoader roomIdOrAlias={roomIdOrAlias}>
              {(summary) => (
                <RoomCard
                  style={{ maxWidth: toRem(364), width: '100%' }}
                  roomIdOrAlias={roomIdOrAlias}
                  allRooms={allRooms}
                  avatarUrl={summary?.avatar_url}
                  name={summary?.name}
                  topic={summary?.topic}
                  memberCount={summary?.num_joined_members}
                  roomType={summary?.room_type}
                  renderTopicViewer={(name, topic, requestClose) => (
                    <RoomTopicViewer name={name} topic={topic} requestClose={requestClose} />
                  )}
                  onView={handleView}
                />
              )}
            </RoomSummaryLoader>
          </Box>
        </Scroll>
      </Box>
    </Page>
  );
}
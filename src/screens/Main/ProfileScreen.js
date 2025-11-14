import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGenres} from '../../api/tmdb';
import {logoutUser} from '../../features/authSlice';
import DeviceInfo from 'react-native-device-info';

export default function ProfileScreen() {
  const user = useSelector(s => s.auth.user);
  const watchlist = useSelector(s => s.watchlist.list);
  const dispatch = useDispatch();

  const [genreMap, setGenreMap] = useState({});
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await fetchGenres();
        if (!genreList?.genres) return;

        const map = {};
        genreList.genres.forEach(g => (map[g.id] = g.name));
        setGenreMap(map);
      } catch (error) {
        console.warn('Failed to fetch genres:', error.message);
      }
    };

    const getAppVersion = () => {
      setAppVersion(DeviceInfo.getVersion());
    };

    loadGenres();
    getAppVersion();
  }, []);

  const computeGenres = () => {
    if (!watchlist || watchlist.length === 0) return [];
    const counts = {};

    watchlist.forEach(m => {
      m.genre_ids?.forEach(id => (counts[id] = (counts[id] || 0) + 1));
      m.genres?.forEach(g => (counts[g.id] = (counts[g.id] || 0) + 1));
    });

    return Object.keys(counts)
      .map(k => ({id: k, name: genreMap[k] || 'Unknown', count: counts[k]}))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const data = computeGenres();
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.version}>App Version: {appVersion}</Text>
        </View>

        {/* Watchlist Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Watchlisted Movies: {watchlist.length}
          </Text>
        </View>

        {/* Top Genres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Genres</Text>
          {data.length === 0 ? (
            <Text style={styles.emptyText}>
              Add movies to watchlist to see genre stats.
            </Text>
          ) : (
            <Svg width={320} height={200}>
              {data.map((d, i) => {
                const w = (d.count / max) * 200;
                return (
                  <React.Fragment key={d.id}>
                    <SvgText x={4} y={20 + i * 30} fontSize={12} fill="#1B263B">
                      {d.name}
                    </SvgText>
                    <Rect
                      x={100}
                      y={12 + i * 30}
                      width={w}
                      height={8}
                      rx={6}
                      fill="#D4AF37"
                    />
                    <SvgText
                      x={105 + w}
                      y={20 + i * 30}
                      fontSize={10}
                      fill="#1B263B">
                      {d.count}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          )}
        </View>
      </ScrollView>

      {/* Logout Button at Bottom */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => dispatch(logoutUser())}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 16,
  },
  userInfo: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B263B',
    textTransform: 'capitalize',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: '#1B263B',
  },
  version: {
    marginTop: 2,
    fontSize: 12,
    color: '#1B263B',
    opacity: 0.7,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    color: '#1B263B',
  },
  emptyText: {
    opacity: 0.5,
    color: '#1B263B',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#D4AF37',
    padding: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: '#1B263B',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});

// import React, {useEffect} from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import Svg, {Rect, Text as SvgText} from 'react-native-svg';
// import {useDispatch, useSelector} from 'react-redux';
// import {fetchGenres} from '../../api/tmdb';
// import {logoutUser} from '../../features/authSlice';

// export default function ProfileScreen() {
//   const user = useSelector(s => s.auth.user);
//   const watchlist = useSelector(s => s.watchlist.list);
//   const dispatch = useDispatch();

//   const [genreMap, setGenreMap] = React.useState({});

//   useEffect(() => {
//     const loadGenres = async () => {
//       try {
//         const genreList = await fetchGenres();
//         if (!genreList?.genres) return;

//         const map = {};
//         genreList.genres.forEach(g => (map[g.id] = g.name));
//         setGenreMap(map);
//       } catch (error) {
//         console.warn('Failed to fetch genres:', error.message);
//       }
//     };

//     loadGenres();
//   }, []);

//   const computeGenres = () => {
//     if (!watchlist || watchlist.length === 0) return [];
//     const counts = {};

//     watchlist.forEach(m => {
//       m.genre_ids?.forEach(id => (counts[id] = (counts[id] || 0) + 1));
//       m.genres?.forEach(g => (counts[g.id] = (counts[g.id] || 0) + 1));
//     });

//     return Object.keys(counts)
//       .map(k => ({id: k, name: genreMap[k] || 'Unknown', count: counts[k]}))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 6);
//   };

//   const data = computeGenres();
//   const max = Math.max(...data.map(d => d.count), 1);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.name}>{user?.name || 'User'}</Text>
//       <Text style={styles.email}>{user?.email}</Text>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>
//           Watchlisted Movies: {watchlist.length}
//         </Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Top Genres</Text>
//         {data.length === 0 ? (
//           <Text style={styles.emptyText}>
//             Add movies to watchlist to see genre stats.
//           </Text>
//         ) : (
//           <Svg width={320} height={200}>
//             {data.map((d, i) => {
//               const w = (d.count / max) * 200;
//               return (
//                 <React.Fragment key={d.id}>
//                   <SvgText x={4} y={20 + i * 30} fontSize={12} fill="#2E2E2E">
//                     {d.name}
//                   </SvgText>
//                   <Rect
//                     x={100}
//                     y={6 + i * 30}
//                     width={w}
//                     height={18}
//                     rx={6}
//                     fill="#D4AF37"
//                   />
//                   <SvgText
//                     x={105 + w}
//                     y={20 + i * 30}
//                     fontSize={10}
//                     fill="#1B263B">
//                     {d.count}
//                   </SvgText>
//                 </React.Fragment>
//               );
//             })}
//           </Svg>
//         )}
//       </View>

//       <TouchableOpacity
//         style={styles.logoutButton}
//         onPress={() => dispatch(logoutUser())}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F9FAFB',
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1B263B',
//   },
//   email: {
//     marginTop: 4,
//     fontSize: 14,
//     color: '#2E2E2E',
//   },
//   section: {
//     marginTop: 18,
//   },
//   sectionTitle: {
//     fontWeight: '700',
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#1B263B',
//   },
//   emptyText: {
//     opacity: 0.5,
//     color: '#2E2E2E',
//   },
//   logoutButton: {
//     marginTop: 26,
//     backgroundColor: '#FF6B6B',
//     padding: 12,
//     borderRadius: 8,
//   },
//   logoutText: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontWeight: '700',
//   },
// });

import React, {useEffect} from 'react';
import {fetchGenres} from '../../api/tmdb';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';

export default function ProfileScreen() {
  const user = useSelector(s => s.auth.user);
  const watchlist = useSelector(s => s.watchlist.list);
  const dispatch = useDispatch();
  const [genreMap, setGenreMap] = React.useState({});

  useEffect(() => {
    fetchGenres()
      .then(gs => {
        const map = {};
        gs.forEach(g => (map[g.id] = g.name));
        setGenreMap(map);
      })
      .catch(console.warn);
  }, []);

  const computeGenres = () => {
    const counts = {};
    watchlist.forEach(m => {
      if (m.genre_ids)
        m.genre_ids.forEach(id => (counts[id] = (counts[id] || 0) + 1));
      if (m.genres)
        m.genres.forEach(g => (counts[g.id] = (counts[g.id] || 0) + 1));
    });
    const arr = Object.keys(counts).map(k => ({
      id: k,
      name: genreMap[k] || 'Unknown',
      count: counts[k],
    }));
    return arr.sort((a, b) => b.count - a.count).slice(0, 6);
  };

  const data = computeGenres();
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <ScrollView style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 22, fontWeight: '700'}}>
        {user?.name || 'User'}
      </Text>
      <Text style={{marginTop: 4}}>{user?.email}</Text>

      <View style={{marginTop: 18}}>
        <Text style={{fontWeight: '700'}}>
          Watchlisted movies: {watchlist.length}
        </Text>
      </View>

      <View style={{marginTop: 18}}>
        <Text style={{fontWeight: '700', marginBottom: 8}}>Top genres</Text>
        <Svg width={320} height={200}>
          {data.map((d, i) => {
            const w = (d.count / max) * 200;
            return (
              <React.Fragment key={d.id}>
                <SvgText x={4} y={20 + i * 30} fontSize={12}>
                  {d.name}
                </SvgText>
                <Rect x={100} y={6 + i * 30} width={w} height={18} rx={6} />
                <SvgText x={105 + w} y={20 + i * 30} fontSize={10}>
                  {d.count}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <TouchableOpacity
        onPress={() => dispatch(logoutUser())}
        style={{
          marginTop: 26,
          backgroundColor: '#ff6b6b',
          padding: 12,
          borderRadius: 8,
        }}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

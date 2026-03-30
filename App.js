import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, FlatList,
  Animated, StyleSheet, SafeAreaView, Modal,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'karteikarten_words';
const INIT_KEY    = 'karteikarten_initialized_v7';
const STATS_KEY   = 'karteikarten_stats';

const DEFAULT_WORDS = [
  { en: 'sumo', de: 'Sumo', definition: 'a Japanese form of wrestling, done by men who are very large', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'courtroom', de: 'Gerichtssaal', definition: 'a room in a law court where cases are judged', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'back (sb/st) up', de: 'etwas/jmd verstärken', definition: 'to provide support or help for someone or something', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'absolutely', de: 'vollkommen', definition: 'completely and in every way', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'rely on', de: 'sich verlassen auf', definition: 'to trust or depend on someone or something to do what you need or expect them to do', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'find out', de: 'herausfinden', definition: 'to get information, after trying to discover it or by chance', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'get away', de: 'wegkommen', definition: 'to leave a place, especially when this is not easy', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'comparison', de: 'Vergleich', definition: 'the process of comparing two or more people or things', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'outdated', de: 'altmodisch', definition: 'if something is outdated, it is no longer considered useful or effective, because something more modern exists', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'shed', de: 'Schuppen', definition: 'a small building, often made of wood, used especially for storing things', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'undercover', de: 'verdeckt, geheim', definition: 'undercover work is usually done secretly by the police in order to catch criminals or find out information', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'prefer', de: 'bevorzugen', definition: 'to like someone or something more than someone or something else', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'issue', de: 'Thema, Frage', definition: 'a subject or problem that is often discussed or argued about, especially a social or political matter that affects the interests of a lot of people', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'treehouse', de: 'Baumhaus', definition: 'a wooden structure built in the branches of a tree for children to play in', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'atmosphere', de: 'Atmosphäre', definition: 'the feeling that an event or place gives you', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'go from strength to strength', de: 'immer stärker werden, immer erfolgreicher werden', definition: 'to become more and more successful', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'endurance', de: 'Ausdauer', definition: 'the ability to continue doing something difficult or painful over a long period of time', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'underwater', de: 'Unterwasser-', definition: 'below the surface of an area of water, or able to be used there', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'therapy', de: 'Therapie', definition: 'the treatment of an illness or injury over a fairly long period of time', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'outweigh', de: 'überwiegen', definition: 'to be more important or valuable than something else', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'the press', de: 'die Presse', definition: 'people who write reports for newspapers, radio, or television', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'impress', de: 'beeindrucken', definition: 'to make someone feel admiration and respect', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'glacier', de: 'Gletscher', definition: 'a large mass of ice which moves slowly down a mountain valley', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'keep a straight face', de: 'keine Miene verziehen', definition: 'to not laugh or smile, even though something is funny', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'treatment', de: 'Behandlung', definition: 'something that is done to cure someone who is injured or ill', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'be cut off', de: 'abgeschnitten von', definition: 'if a place is cut off, people cannot leave it or reach it', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'move out', de: 'ausziehen', definition: 'to leave the house where you are living now in order to go and live somewhere else', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'earphone', de: 'Ohrhörer, Kopfhörer', definition: 'a small piece of equipment connected by a wire to a radio, personal stereo, etc., which you put in or over your ears so that only you can listen to it', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'inconsistent', de: 'nicht übereinstimmend', definition: 'two statements that are inconsistent cannot both be true', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'alarming', de: 'alarmierend', definition: 'making you feel worried or frightened', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'deer', de: 'Hirsch', definition: 'a large wild animal that can run very fast, eats grass, and has horns', group: 'Gruppe 1', collection: 'First vocabulary' },
  { en: 'soya bean', de: 'Sojabohne', definition: 'the bean of an Asian plant from which oil and food containing a lot of protein are produced', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'catch (sb\'s) eye', de: 'jmds Blick auf sich ziehen', definition: 'to attract someone\'s attention and make them look at something', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'intention', de: 'Absicht', definition: 'a plan or desire to do something', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'nominate', de: 'ernennen', definition: 'to officially suggest someone or something for an important position, duty, or prize', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'household name', de: 'allgemein bekannter Name', definition: 'a name of a product, company, etc., that is very well known', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'compelling', de: 'zwingend', definition: 'an argument, etc., that makes you feel certain that something is true or that you must do something about it', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'widely', de: 'weit, weithin', definition: 'in a lot of different places or by a lot of people', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'date back to', de: 'stammen aus', definition: 'to have existed since a particular time in the past', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'orphanage', de: 'Waisenhaus', definition: 'a large house where children who are orphans live and are taken care of', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'therapeutic', de: 'therapeutisch, wohltuend', definition: 'making you feel calm and relaxed', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'take into account', de: 'berücksichtigen', definition: 'to consider or include particular facts or details when making a decision or judgment about something', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'hydrated', de: 'hydriert', definition: 'to be supplied with water to keep healthy and in good condition', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'valuable', de: 'wertvoll', definition: 'valuable help, advice or information, etc., is very useful because it helps you to do something', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'make it', de: 'schaffen', definition: 'to succeed in getting somewhere in time for something or when this is difficult', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'inner', de: 'innerer', definition: 'on the inside or close to the centre of something', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'intake', de: 'Aufnahme, Einnahme', definition: 'the amount of food, drink, etc., that you take into your body', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'antisocial', de: 'asozial', definition: 'antisocial behaviour is violent or harmful to other people, or shows that you do not care about other people', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'trapped', de: 'eingeschlossen, gefangen', definition: 'unable to escape from somewhere, especially a dangerous place', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'reflexes', de: 'Reflexe', definition: 'the natural ability to react quickly and well to sudden situations', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'specific', de: 'bestimmt', definition: 'a specific thing, person, or group is one particular thing, person, or group', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'demand', de: 'Nachfrage', definition: 'the need or desire that people have for particular goods and services', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'iconic', de: 'kultig, Kult-', definition: 'in recent times this has come to refer to highly original, influential or unique works or art, artists or performers who have become very popular and stylish', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'objection', de: 'Einwand', definition: 'a reason that you have for opposing or disapproving of something, or something you say that expresses this', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'feel', de: 'fühlen', definition: 'to experience a particular physical feeling or emotion', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'influence', de: 'Einfluss', definition: 'the power to affect the way someone or something develops, behaves, or thinks, without using direct force or orders', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'adapt', de: 'sich gewöhnen an, anpassen', definition: 'to gradually change your behaviour and attitudes in order to be successful in a new situation', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'standard of living', de: 'Lebensstandard', definition: 'the amount of wealth, comfort, and other things that a particular person, group, country, etc., has', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'crazed', de: 'verrückt, wirr', definition: 'behaving in a wild and uncontrolled way like someone who is mentally ill', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'pace', de: 'Tempo', definition: 'the speed at which something happens or is done', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'extent', de: 'Ausmaß', definition: 'used to say how true something is or how great an effect or change is', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'perspective', de: 'Perspektive', definition: 'a way of thinking about something, especially one which is influenced by the type of person you are or by your experiences', group: 'Gruppe 2', collection: 'First vocabulary' },
  { en: 'playlist', de: 'Playlist, Wiedergabeliste', definition: 'the list of songs that a radio station plays', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'refer to', de: 'etwas ansprechen', definition: 'to mention or speak about someone or something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'status update', de: 'Statusaktualisierun g', definition: 'a short, text-based entry on a social media site which tells your friends what you\'re doing or shares information, pictures or links', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'vitamin', de: 'Vitamin', definition: 'a chemical substance in food that is necessary for good health', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'dedicated', de: 'engagiert', definition: 'someone who is dedicated works very hard at what they do because they care a lot about it', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'disapprove', de: 'missbilligen', definition: 'to think that someone or their behaviour, ideas, etc., are bad or wrong', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'set aside', de: 'beiseite stellen', definition: 'to be moved aside so not in the way', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'push yourself', de: 'sich viel abverlangen', definition: 'to encourage or force yourself to do something or work hard to achieve something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'leap into action', de: 'einsatzbereit sein', definition: 'if you leap or spring into action, you suddenly start doing something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'follow in (sb\'s) footsteps', de: 'in jmds Fußstapfen treten', definition: 'to do the same thing as someone else, e.g. one of your parents, has done', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'objective', de: 'Ziel', definition: 'something that you are trying hard to achieve, especially in business or politics', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'irrational', de: 'irrational', definition: 'not based on clear thought or reason', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'South Pole', de: 'Südpol', definition: 'the most southern point on the surface of the Earth', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'tropical', de: 'tropisch', definition: 'coming from or existing in the hottest parts of the world', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'frustrated', de: 'frustriert', definition: 'feeling annoyed, upset, and impatient, because you cannot control or change a situation, or achieve something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'cognitive', de: 'kognitiv', definition: 'related to the process of knowing, understanding, and learning something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'short-sighted', de: 'kurzsichtig', definition: 'unable to see objects clearly unless they are very close', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'adequate', de: 'ausreichend, genügend', definition: 'enough in quantity or of a good enough quality for a particular purpose', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'comfort zone', de: 'Komfortzone', definition: 'your comfort zone is the range of activities or situations that you feel happy and confident in', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'script', de: 'Textbuch, Rollenheft', definition: 'the written form of a speech, play, film, etc.', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'policy', de: 'Regel, Vorschrift', definition: 'a way of doing something that has been officially agreed and chosen by a political party, a business, or another organization', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'transform', de: 'verändern, verwandeln', definition: 'to completely change the appearance, form, or character of something or someone, especially in a way that improves it', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'appreciate', de: 'wertschätzen, anerkennen', definition: 'to understand how serious or important a situation or problem is or what someone’s feelings are', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'cowardice', de: 'Feigheit', definition: 'lack of courage', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'client', de: 'Kunde/Kundin', definition: 'someone who gets services or advice from a professional person, company, or organization', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'social worker', de: 'Sozialarbeiter/in', definition: 'someone who is trained to help people who are poor, have family problems, etc.', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'pay its way', de: 'kostendeckend sein', definition: 'if a shop or business makes as much profit as it costs to run, it pays its way', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'put you in the mood', de: 'Lust machen zu', definition: 'to motivate you or put you in a particular state of mind for doing something', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'clapboard house', de: 'Schindelhaus', definition: 'a design of house which is covered in horizontal wooden boards', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'misinterpret', de: 'falsch verstehen', definition: 'to not understand the correct meaning of something that someone says or does, or of facts that you are considering', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'blame (st) on (sb)', de: 'jmd für etwas die Schuld geben', definition: 'to say or think that someone or something is responsible for something bad', group: 'Gruppe 3', collection: 'First vocabulary' },
  { en: 'skydive', de: 'fallschirmspringen', definition: 'the sport of jumping from a plane and falling through the sky before opening a parachute', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'chimpanzee', de: 'Schimpanse', definition: 'an intelligent African animal that is like a large monkey without a tail', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'survive', de: 'überleben', definition: 'to continue to live normally in spite of many problems', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'timid', de: 'schüchtern', definition: 'not having courage or confidence', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'consult', de: 'konsultieren, zu Rate ziehen', definition: 'to ask for information or advice from someone because it is their job to know something', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'come face to face', de: 'plötzlich gegenüberstehen', definition: 'to meet someone, especially in a way that surprises or frightens you', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'in tune with', de: 'in Harmonie mit', definition: 'to feel in harmony with someone or something', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'madness', de: 'Wahnsinn', definition: 'very stupid behaviour that could be dangerous or have a very bad effect', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'mega', de: 'mega', definition: 'very big and impressive or enjoyable', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'meditation', de: 'Meditation', definition: 'the practice of emptying your mind of thoughts and feelings, in order to relax completely or for religious reasons', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'crucial', de: 'entscheidend, zentral', definition: 'something that is crucial is extremely important, because everything else depends on it', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'exceptional', de: 'außerordentlich', definition: 'unusually good', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'keen on', de: 'scharf sein auf, Lust haben auf', definition: 'to like someone or something', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'debt', de: 'Schulden', definition: 'a sum of money that a person or organization owes', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'parallel', de: 'Parallele', definition: 'a relationship or similarity between two things, especially things that exist or happen in different places or at different times', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'dress up', de: 'sich verkleiden', definition: 'to wear special clothes for fun, or to put special clothes on someone', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'highlight', de: 'Höhepunkt', definition: 'the most important, interesting or enjoyable part of something such a holiday, performance, or sports competition', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'beetroot', de: 'rote Bete', definition: 'a plant with a round dark red root that you cook and eat as a vegetable', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'draw out', de: 'herausziehen', definition: 'to take something out of a container, pocket, etc.', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'performance', de: 'Leistung', definition: 'how well or badly a person, company, etc., does a particular job or activity', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'impromptu', de: 'spontan', definition: 'done or said without any preparation or planning', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'water-skiing', de: 'Wasserskilaufen', definition: 'a sport in which you ski over water while being pulled by a boat', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'primitive', de: 'primitiv, urzeitlich', definition: 'belonging to a simple way of life that existed in the past and does not have modern industries and machines', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'field', de: 'Feld', definition: 'an area of land in the country, especially one where crops are grown or animals feed on grass', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'addicted to', de: 'süchtig sein nach', definition: 'unable to stop taking a harmful substance, especially a drug', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'deliberately', de: 'absichtlich', definition: 'done in a way that is intended or planned', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'track', de: 'Musikstück', definition: 'one of the songs or pieces of music on a record, CD, etc.', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'define', de: 'definieren', definition: 'to describe something correctly and thoroughly, and to say what standards, limits, qualities, etc., it has that make it different from other things', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'intellectual property', de: 'geistiges Eigentum', definition: 'something which someone has invented or has the right to make or sell, especially something that cannot legally be copied by other people', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'attachment', de: 'Verbundenheit, Bindung', definition: 'a feeling that you like or love someone or something and that you would be unhappy without them', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'seal', de: 'Seehund', definition: 'a large sea animal that eats fish and lives around coasts', group: 'Gruppe 4', collection: 'First vocabulary' },
  { en: 'approach', de: 'Ansatz, Annäherung', definition: 'a method of doing something or dealing with a problem', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'let go', de: 'loslassen', definition: 'to accept that you cannot change something and stop thinking or worrying about it', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'unaware of', de: 'unwissend, ahnungslos', definition: 'not noticing or realizing what is happening', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'unimaginable', de: 'unvorstellbar', definition: 'not possible to imagine', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'Parade ground', de: 'Exerzierplatz', definition: 'a place where soldiers practise marching or standing together in rows.', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'get through to', de: 'jmd erreichen', definition: 'to reach a place or person that is difficult to reach', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'aggressive', de: 'aggressiv', definition: 'behaving in an angry threatening way, as if you want to fight or attack someone', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'take over', de: 'übernehmen', definition: 'to take control of something', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'control', de: 'kontrollieren', definition: 'to have the power to make the decisions about how a country, place, company, etc., is organized or what it does', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'excessive', de: 'zu viel, übermäßig', definition: 'much more than is reasonable or necessary', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'distraction', de: 'Ablenkung', definition: 'something that stops you paying attention to what you are doing', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'possess', de: 'haben, besitzen', definition: 'to have a particular quality or ability', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'brandish', de: 'schwingen', definition: 'to wave something around in a dangerous or threatening way, especially a weapon', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'ballad', de: 'Ballade', definition: 'a slow love song', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'accustomed to', de: 'gewöhnt an', definition: 'to be familiar with something and accept it as normal', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'for the sake of (sb/st)', de: 'zuliebe', definition: 'in order to help, improve, or please someone or something', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'synonymous with', de: 'synonym mit, gleichbedeutend mit', definition: 'something that is synonymous with something else is considered to be very closely connected with it', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'likelihood', de: 'Wahrscheinlichkeit', definition: 'the degree to which something can reasonably be expected to happen', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'considerable', de: 'beträchtlich', definition: 'fairly large, especially large enough to have an effect or be important', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'link', de: 'Verbindung', definition: 'a relationship or connection between two or more people, countries, etc.', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'tight budget', de: 'knappes Budget', definition: 'when money is limited and you have to be careful of how you spend it', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'potential', de: 'potenziell', definition: 'likely to develop into a particular type of person or thing in the future', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'throw (st) out', de: 'wegwerfen', definition: 'to get rid of something that you do not want or need', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'tarmac', de: 'Asphalt', definition: 'a mixture of tar and very small stones, used for making the surface of roads', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'victory blow', de: 'Siegesschlag', definition: 'the winning or last, and potentially fatal blow (= a hard hit with someone\'s hand, or a tool or a weapon)', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'indifference', de: 'Gleichgültigkeit', definition: 'lack of interest or concern', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'humanity', de: 'Menschheit', definition: 'people in general', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'eye-opening', de: 'die Augen öffnend, erhellend', definition: 'an experience from which you learn something surprising or new', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'hedonistic', de: 'hedonistisch', definition: 'someone who believes that pleasure is the most important thing in life', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'priority', de: 'Priorität', definition: 'the thing that you think is most important and that needs attention before anything else', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'harm', de: 'Schaden', definition: 'damage, injury, or trouble caused by someone’s actions or by an event', group: 'Gruppe 5', collection: 'First vocabulary' },
  { en: 'give up on (sb/st)', de: 'etwas/jmd aufgeben', definition: 'to stop hoping that someone or something will change or improve', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'bypass surgery', de: 'Bypass-Operation', definition: 'an operation to direct blood through new veins (= blood tubes) outside the heart because the veins in the heart are blocked or diseased', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'highs and lows', de: 'Höhen und Tiefen', definition: 'feelings of great happiness or excitement and ones of great sadness and disappointment', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'eliminate', de: 'überflüssig machen', definition: 'to completely get rid of something that is unnecessary or unwanted', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'enjoy', de: 'mögen, Gefallen finden an', definition: 'to get pleasure from something', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'wrestler', de: 'Ringer/in, Wrestler/in', definition: 'someone who takes part in wrestling', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'inspiration', de: 'Inspiration', definition: 'a good idea about what you should do, write, say, etc., especially one which you get suddenly', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'enable', de: 'ermöglichen', definition: 'to make it possible for someone to do something, or for something to happen', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'basis', de: 'Basis', definition: 'relating to a regular activity or event which takes place', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'laid-back', de: 'entspannt', definition: 'relaxed and seeming not to be worried about anything', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'microchip', de: 'Mikrochip', definition: 'a very small piece of silicon containing a set of electronic parts, which is used in computers and other machines', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'addict', de: 'Süchtige/r', definition: 'someone who is unable to stop taking drugs', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'airgun', de: 'Luftgewehr', definition: 'a gun that uses air pressure to fire small round bullets', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'phobia', de: 'Phobie', definition: 'a strong unreasonable fear of something', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'campsite', de: 'Campingplatz', definition: 'an area where people can camp, often with a water supply and toilets', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'under pressure', de: 'unter Druck', definition: 'a way of working or living that causes you a lot of anxiety, especially because you feel you have too many things to do', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'face up to', de: 'etwas ins Auge sehen', definition: 'to accept and deal with a difficult fact or problem', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'lifestyle', de: 'Lebensweise', definition: 'the way a person or group of people live, including the place they live in, the things they own, the kind of job they do, and the activities they enjoy', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'wide-reaching', de: 'weitreichend', definition: 'enjoyed by many', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'get the impression', de: 'einen Eindruck bekommen', definition: 'to have an idea, opinion or feeling about someone or something because of the way they seem', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'sense of relief', de: '(Gefühl der) Erleichterung', definition: 'a feeling of cheerfulness or positivity that follows the removal of anxiety, pain or distress', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'smoothie', de: 'Smoothie', definition: 'a thick drink made of fruit and fruit juices mixed together, sometimes with ice, milk, or yoghurt', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'regrettable', de: 'bedauernswert', definition: 'something that is regrettable is unpleasant, and you wish things could be different', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'hard-headed', de: 'unnachgiebig', definition: 'practical and able to make difficult decisions without letting your emotions affect your judgment', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'scam', de: 'Betrug', definition: 'a clever but dishonest way to get money', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'inhospitable', de: 'unwirtlich', definition: 'an inhospitable place is difficult to live or stay in because the weather conditions are unpleasant or there is no shelter', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'recall', de: 'sich erinnern', definition: 'to remember a particular fact, event, or situation from the past', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'competitive', de: 'wettbewerbsfähig', definition: 'determined or trying very hard to be more successful than other people or businesses', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'unity', de: 'Einheit, Einigkeit', definition: 'when a group of people or countries agree or are joined together', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'resist', de: 'unempfindlich sein für, standhalten gegen', definition: 'to not be changed or harmed by something', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'dissolve', de: 'auflösen, zersetzen', definition: 'if a solid dissolves, or if you dissolve it, it mixes with a liquid and becomes part of it', group: 'Gruppe 6', collection: 'First vocabulary' },
  { en: 'quite', de: 'recht, ziemlich', definition: 'very, but not extremely', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'get on with', de: 'zurechtkommen mit', definition: 'if people get on with each other, they like each other and have a friendly relationship', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'appropriate', de: 'angemessen, geeignet', definition: 'correct or suitable for a particular time, situation, or purpose', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'misbehave', de: 'sich schlecht benehmen', definition: 'to behave badly, and cause trouble or annoy people', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'loan', de: 'Kredit', definition: 'an amount of money that you borrow from a bank, etc.', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'miss out on', de: 'verpassen', definition: 'miss a chance to do or achieve something', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'propose', de: 'vorschlagen', definition: 'to suggest something as a plan or course of action', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'extreme', de: 'extrem', definition: 'very great in degree', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'remote', de: 'entlegen', definition: 'far from towns or other places where people live', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'potentially', de: 'potenziell, möglicherweise', definition: 'something that is potentially dangerous, useful, etc., is not dangerous, etc., now, but may become so in the future', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'replace', de: 'ersetzen', definition: 'to start doing something instead of another person, or start being used instead of another thing', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'fame', de: 'Ruhm', definition: 'the state of being known about by a lot of people because of your achievements', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'functional', de: 'funktional', definition: 'designed to be useful rather than beautiful or attractive', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'superficial', de: 'oberflächlich', definition: 'someone who is superficial does not think about things that are serious or important – used to show disapproval', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'excess', de: 'Überschüssiges', definition: 'a larger amount of something than is allowed or needed', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'irresistible', de: 'unwiderstehlich', definition: 'so attractive, desirable, etc., that you cannot prevent yourself from wanting it', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'fixed personality', de: 'feste Persönlichkeit', definition: 'to have a personality that does not change', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'psychology', de: 'Psychologie', definition: 'the study of the mind and how it influences people’s behaviour', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'blood pressure', de: 'Blutdruck', definition: 'the force with which blood travels through your body', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'let (sb) off (st)', de: 'jmd frei geben', definition: 'if something in authority lets you off something you should do, they give you permission not to do it', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'intense', de: 'stark, hochgradig', definition: 'having a very strong effect or felt very strongly', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'shop-lifting', de: 'Ladendiebstahl', definition: 'the crime of stealing things from shops, for example by hiding them in a bag or under your clothes', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'attainable', de: 'erreichbar', definition: 'if something is attainable, it can be achieved – usually after a lot of effort', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'powerful', de: 'mächtig', definition: 'a powerful person, organization, group, etc., is able to control and influence events and other people’s actions', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'condition', de: 'Krankheit, Beschwerde', definition: 'an illness or health problem that affects you permanently or for a very long time', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'prediction', de: 'Vorhersage', definition: 'a statement about what you think is going to happen, or the act of making this statement', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'process', de: 'Prozess', definition: 'a series of actions that are done in order to achieve a particular result', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'care', de: 'Pflege', definition: 'the process of looking after someone, especially because they are ill, old, or very young', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'drawback', de: 'Nachteil', definition: 'a disadvantage of a situation, plan, product, etc.', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'stand-up comedian', de: 'Stand-Up- Comedian, Kabarettist', definition: 'a comic performer who usually speaks directly to the live audience they perform in front of', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'sum (st) up', de: 'etw zusammenfassen', definition: 'to describe someone/something using only a few words', group: 'Gruppe 7', collection: 'First vocabulary' },
  { en: 'iceberg', de: 'Eisberg', definition: 'a very large mass of ice floating in the sea, most of which is under the surface of the water', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'resource', de: 'Ressource', definition: 'something such as useful land, or minerals such as oil or coal, that exists in a country and can be used to increase its wealth', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'anti-establishment', de: 'gegen das Establishment', definition: 'opposed to or working against the government or another power structure in society', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'culprit', de: 'Schuldige/r', definition: 'the person who is guilty of a crime or doing something wrong', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'hoody', de: 'Kapuzenpulli', definition: 'a loose jacket or top made of soft material, which has a hood', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'holder', de: 'Halter/in', definition: 'someone who owns or controls something', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'myostatin', de: 'Myostatin', definition: 'A protein which regulates the size of muscles.', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'settle in', de: 'sich eingewöhnen', definition: 'to begin to feel happy and relaxed in a new situation, home, job, or school', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'caution', de: 'Vorsicht', definition: 'the quality of being very careful to avoid danger or risks', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'regard', de: 'schätzen, hoch ansehen', definition: 'to think about someone or something in a particular way', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'investigate', de: 'untersuchen', definition: 'to try to find out the truth about something such as a crime, accident, or scientific problem', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'take (sb/st) for granted', de: 'als selbstverständlich ansehen', definition: 'to expect that someone or something will always be there when you need them and never think how important or useful they are', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'ground rules', de: 'Grundregeln', definition: 'the basic rules or principles on which future actions or behaviour should be based', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'source of income', de: 'Einkommensquelle', definition: 'a thing, place, activity, etc., where you get your money/income from', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'polluted', de: 'verschmutzt, verseucht', definition: 'dangerously dirty and not suitable for people to use', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'miserable', de: 'elend, unglücklich', definition: 'extremely unhappy, for example because you feel lonely, cold, or badly treated', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'pellet', de: 'Flocken, Pellet', definition: 'a small ball of a substance', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'entitle', de: 'betiteln, den Titel haben', definition: 'if a book, play, etc., is entitled something, that is its name', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'put (sb) off', de: 'jmd abstoßen', definition: 'to make you dislike something or not want to do something', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'adequately', de: 'ausreichend', definition: 'fairly good but not excellent, same meaning as satisfactory', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'take off', de: 'abheben', definition: 'to suddenly become successful', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'privacy', de: 'Privatsphäre', definition: 'the state of being able to be alone, and not seen or heard by other people', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'eventually', de: 'schließlich', definition: 'after a long time, or after a lot of things have happened', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'put your foot in it', de: 'ins Fettnäpfchen treten', definition: 'to say something without thinking carefully, so that you embarrass or upset someone', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'mind-blowing', de: 'überwältigend', definition: 'very exciting, shocking, or strange', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'remain', de: 'bleiben', definition: 'to continue to be in the same state or condition', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'content', de: 'zufrieden', definition: 'happy and satisfied', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'opponent', de: 'Gegner/in', definition: 'someone who you try to defeat in a competition, game, fight, or argument', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'authentically', de: 'authentisch', definition: 'done or made in the traditional or original way', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'break out', de: 'ausbrechen', definition: 'if something unpleasant such as a fire, fight, or war breaks out, it starts to happen', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'chilling', de: 'unheimlich, gruselig', definition: 'something that is chilling makes you feel frightened, especially because it is cruel, violent, or dangerous', group: 'Gruppe 8', collection: 'First vocabulary' },
  { en: 'population', de: 'Bevölkerung', definition: 'the number of people living in a particular area, country, etc.', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'meek', de: 'sanftmütig, bescheiden', definition: 'very quiet and gentle and unwilling to argue with people', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'cut down on', de: 'reduzieren', definition: 'to reduce the amount of something', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'submerge', de: 'überschwemmen', definition: 'to cover something completely with water or another liquid', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'value', de: 'Wert legen auf', definition: 'to think that someone or something is important', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'supervision', de: 'Betreuung', definition: 'when you supervise (= are in charge of) someone or something and make sure things are done correctly', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'symbol', de: 'Symbol', definition: 'a picture or shape that has a particular meaning or represents a particular organization or idea', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'challenge', de: 'Herausforderung', definition: 'something that tests strength, skill, or ability, especially in a way that is interesting', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'deterioration', de: 'Verschlechterung', definition: 'in a worsening condition', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'monopoly', de: 'Monopol', definition: 'a company or government that has complete control so others cannot compete with it', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'moral dilemma', de: 'moralischer Zwiespalt', definition: 'a situation in which it is very difficult to decide what to do based on your moral principles, because all the choices seem equally good or equally bad', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'fingerprint', de: 'Fingerabdruck', definition: 'to take someone\'s fingerprints (= the mark made by the pattern of lines at the end of a person’s finger, which is used by the police to find out who has committed a crime)', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'vaguely', de: 'vage, ungenau', definition: 'slightly', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'shared memory', de: 'gemeinsame Erinnerung', definition: 'to have the same memory of an event as someone else', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'be involved in', de: 'beteiligt sein an', definition: 'to take part in an activity or event, or be connected with it in some way', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'strap yourself into', de: 'sich anschnallen', definition: 'to fasten someone in place with one or more straps (= a narrow band of strong material used to tie, hang or hold onto something)', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'overshadow', de: 'etwas in den Schatten stellen', definition: 'to make someone or something else seem less important', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'misty', de: 'neblig', definition: 'misty weather is weather with a lot of mist', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'be coming up', de: 'bevorstehen', definition: 'to be going to happen soon', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'cyber', de: 'Cyber-', definition: 'relating to computers, especially to messages and information on the Internet', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'hand in your notice', de: 'kündigen', definition: 'to tell your employer that you will be leaving your job soon', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'accuse', de: 'beschuldigen, anklagen', definition: 'to say that you believe someone is guilty of a crime or of doing something bad', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'recognise', de: 'erkennen', definition: 'to know who someone is or what something is, because you have seen, heard, experienced, or learned about them in the past', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'anonymous', de: 'anonym', definition: 'unknown by name', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'wealth', de: 'Wohlstand, Reichtum', definition: 'a large amount of money, property, etc., that a person or country owns', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'status quo', de: 'Status quo', definition: 'the state of a situation as it is', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'suspended sentence', de: 'Bewährungsstrafe', definition: 'a punishment given by a court, in which a criminal is told they will be sent to prison if they do anything else illegal within the time mentioned', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'confide', de: 'anvertrauen', definition: 'to tell someone you trust about personal things that you do not want other people to know', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'proudest', de: 'stolzester', definition: 'feel pleasure or satisfaction as a result of your own achievements, qualities or possessions, or those of someone with whom you are closely associated', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'high-status', de: 'hoch angesehen', definition: 'a person who is greatly respected in society or their professional is high-standing', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'spiritual', de: 'spirituell', definition: 'relating to your spirit rather than to your body or mind', group: 'Gruppe 9', collection: 'First vocabulary' },
  { en: 'run-down', de: 'heruntergekomme n', definition: 'a building or area that is run-down is in very bad condition', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'customary', de: 'üblich', definition: 'something that is customary is normal because it is the way something is usually done', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'count', de: 'zählen', definition: 'thought to be important or valuable', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'bully', de: 'drangsalieren', definition: 'to threaten to hurt someone or frighten them, especially someone smaller or weaker', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'unlock', de: 'aufdecken', definition: 'to discover important factors about something', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'prompt', de: 'veranlassen', definition: 'to make someone decide to do something', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'contemporary', de: 'zeitgenössisch', definition: 'belonging to the present time', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'investigator', de: 'Ermittler', definition: 'someone who investigates things, especially crimes', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'risk-averse', de: 'dem Risiko abgeneigt', definition: 'not willing to take risks', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'nation', de: 'Nation', definition: 'a country, considered especially in relation to its people and its social or economic structure', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'capsaicin', de: 'Capsaicin', definition: 'a colourless and bitter compound present in capsicum (= a type of chilli pepper)', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'bargain', de: 'Schnäppchen, Angebot', definition: 'something you buy cheaply or for less than its usual price', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'minimise', de: 'möglichst gering halten, minimieren', definition: 'to reduce something that is difficult, dangerous, or unpleasant to the smallest possible amount or degree', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'dishonesty', de: 'Unehrlichkeit', definition: 'behaviour in which you deceive or cheat people', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'audition', de: 'Vorsprechen, Vorsingen, Vorspielen', definition: 'a short performance by an actor, singer, etc., that someone watches to judge if they are good enough to act in a play, sing in a concert, etc.', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'limit', de: 'Grenze', definition: 'the greatest or least amount, number, speed, etc., that is allowed', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'get away with', de: 'durchkommen mit', definition: 'to do something without experiencing any problems or difficulties, even though it is not the best thing to do', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'snake bite', de: 'Schlangenbiss', definition: 'the bite of a poisonous snake', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'keep an eye on (sb/st)', de: 'ein Auge werfen auf jmd', definition: 'to look after someone or something and make sure they are safe', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'empower', de: 'stärken', definition: 'to give someone more control over their own life or situation', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'switch to', de: 'wechseln zu', definition: 'to change from doing or using one thing to doing or using another', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'befriend', de: 'sich mit jmd anfreunden', definition: 'to behave in a friendly way towards someone, especially someone who is younger or needs help', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'tablet', de: 'Tablet', definition: 'a very thin, portable computer without a lid, usually powered by batteries and with a touchscreen instead of a keyboard', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'resign', de: 'kündigen', definition: 'to officially announce that you have decided to leave your job or an organization', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'boxer', de: 'Boxer', definition: 'someone who boxes, especially as a job', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'present', de: 'präsentieren', definition: 'to show or describe someone or something', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'feat', de: 'Leistung, Kraftakt', definition: 'something that is an impressive achievement, because it needs a lot of skill, strength, etc., to do', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'plead', de: 'flehen', definition: 'to ask for something that you want very much, in a sincere and emotional way', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'by far', de: 'bei weitem', definition: 'by a great deal, very much', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'speech', de: 'Rede, Vortrag', definition: 'a talk, especially a formal one about a particular subject, given to a group of people', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'adaptation', de: 'Adaption', definition: 'a film or television programme that is based on a book or play', group: 'Gruppe 10', collection: 'First vocabulary' },
  { en: 'fabulous', de: 'fabelhaft', definition: 'extremely good or impressive', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'guilty', de: 'schuldig', definition: 'feeling very ashamed and sad because you know that you have done something wrong', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'descendant', de: 'Nachkomme', definition: 'someone who is related to a person who lived a long time ago, or to a family, group of people, etc., that existed in the past', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'target', de: 'Ziel', definition: 'something that you are trying to achieve, such as a total, an amount, or a time', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'rhythmic', de: 'rhythmisch', definition: 'having a strong rhythm', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'raw talent', de: 'natürliche Begabung', definition: 'someone with raw talent is naturally good at something, but has not developed their ability yet', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'on duty', de: 'im Dienst', definition: 'to be working at a particular time, especially when you\'re doing a job which people take turns to do, so that someone is always doing it', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'all things considered', de: 'alles in allem, unterm Strich', definition: 'when you consider all the parts or events of a situation', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'dairy', de: 'Milchprodukte', definition: 'a place on a farm where milk is kept and butter and cheese are made', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'vertical farmer', de: 'Vertikalfarmer', definition: 'someone who produces food and medicine using an indoor farming technique where the surfaces used for production are vertically stacked', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'sake', de: 'Wohl, Interesse', definition: 'in order to help, improve, or please someone or something', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'balanced diet', de: 'ausgewogene Ernährung', definition: 'a balanced diet is a healthy diet that contains the right foods in the right amounts', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'splash out', de: 'tief in die Tasche greifen', definition: 'to spend a lot of money on something', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'tease', de: 'necken', definition: 'to laugh at someone and make jokes in order to have fun by embarrassing them, either in a friendly way or in an unkind way', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'guided tour', de: 'Führung', definition: 'if someone takes you on a guided tour, they show you around a place of interest and tell you all about it', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'differentiate', de: 'unterscheiden', definition: 'to recognize or express the difference between things or people', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'reach the end of the line', de: 'an ein Ende kommen', definition: 'to get to the end of a process, activity or state', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'antispyware', de: 'Anti-Spionage- Software', definition: 'computer software that is designed to detect and remove spyware (= software which gathers information about a person or organisation without their knowledge or consent)', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'get over (st)', de: 'etwas überwinden', definition: 'to begin to feel better after a very upsetting experience', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'soulmate', de: 'Seelenverwandte/r', definition: 'someone you have a very close relationship with because you share or understand the same emotions and interests', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'study', de: 'Untersuchung, Studie', definition: 'a piece of work that is done to find out more about a particular subject or problem, and usually includes a written report', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'yell', de: 'rufen, schreien', definition: 'to shout or say something very loudly, especially because you are frightened, angry, or excited', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'occur to (sb)', de: 'jmd in den Sinn kommen', definition: 'if an idea or a thought occurs to you, it suddenly comes into your mind', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'jammed', de: 'eingeklemmt', definition: 'stuck and impossible to move', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'routinely', de: 'routinemäßig', definition: 'if something is routinely done, it is done as a normal part of a process or job', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'pressure', de: 'Druck', definition: 'an attempt to persuade someone by using influence, arguments, or threats', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'consecutive', de: 'aufeinanderfolgend', definition: 'consecutive numbers or periods of time follow one after the other without any interruptions', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'get your head around', de: 'verstehen, den Überblick behalten', definition: 'be able to understand something', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'gist', de: 'das Wesentliche', definition: 'the main idea and meaning of what someone has said or written', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'spontaneous', de: 'spontan', definition: 'something that is spontaneous has not been planned or organized, but happens by itself, or because you suddenly feel you want to do it', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'bond', de: 'Bindung', definition: 'something that unites two or more people or groups, such as love, or a shared interest or idea', group: 'Gruppe 11', collection: 'First vocabulary' },
  { en: 'urge', de: 'drängen', definition: 'to strongly suggest that someone does something', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'extended', de: 'verlängert', definition: 'made longer or bigger', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'destined', de: 'bestimmt', definition: 'seeming certain to happen at some time in the future', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'compensate', de: 'kompensieren, ausgleichen', definition: 'to replace or balance the effect of something bad', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'overestimate', de: 'überschätzen', definition: 'to think something is better, more important, etc., than it really is', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'arctic', de: 'Arktis', definition: 'relating to the most northern part of the world', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'natural talent', de: 'Naturtalent', definition: 'a natural ability to do something', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'freelance', de: 'freiberuflich', definition: 'working independently for different companies rather than being employed by one particular company', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'capability', de: 'Fähigkeit, Potenzial', definition: 'the natural ability, skill, or power that makes a machine, person, or organization able to do something, especially something difficult', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'qualification', de: 'Abschluss', definition: 'if you have a qualification, you have passed an examination or course to show you have a particular level of skill or knowledge in a subject', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'aware of', de: 'sich bewusst sein, kennen', definition: 'if you are aware that a situation exists, you realize or know that it exists', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'stalk', de: 'stalken, belästigen', definition: 'to follow and watch someone over a long period of time in a way that is very annoying or threatening, and that is considered a crime in some places', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'overwhelming', de: 'überwältigend', definition: 'having such a great effect on you that you feel confused and do not know how to react', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'put up', de: 'errichten', definition: 'to build or erect something such as a wall, fence, building, etc.', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'diner', de: 'Gast (in einem Restaurant)', definition: 'someone who is eating in a restaurant', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'dedication', de: 'Hingabe', definition: 'hard work or effort that someone puts into a particular activity because they care about it a lot', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'alien', de: 'fremdartig, fremd', definition: 'very different from what you are used to, especially in a way that is difficult to understand or accept', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'lactic acid', de: 'Milchsäure', definition: 'an acid produced by muscles after exercising and found in sour milk', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'commonplace', de: 'weit verbreitet', definition: 'happening or existing in many places, and therefore not special or unusual', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'agonize', de: 'sich quälen, sich martern', definition: 'to think about a difficult decision very carefully and with a lot of effort', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'seaweed', de: 'Algen', definition: 'a plant that grows in the sea', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'reluctant', de: 'widerwillig', definition: 'slow and unwilling', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'out of fashion', de: 'aus der Mode, altmodisch', definition: 'no longer fashionable', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'hunger', de: 'Hunger', definition: 'lack of food, especially for a long period of time, that can cause illness or death', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'none of your business', de: 'geht dich nichts an', definition: 'if something is not your business or none of your business, you should not be involved in it or ask about it', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'mysterious', de: 'geheimnisvoll', definition: 'mysterious events or situations are difficult to explain or understand', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'instinctively', de: 'instinktiv', definition: 'based on instinct and not involving thought', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'contribute', de: 'Teilnehmen, beitragen', definition: 'to give money, help, ideas, etc., to something that a lot of other people are also involved in', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'means', de: 'Mittel', definition: 'the money or income that you have', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'streak', de: 'Zug, Charakterzug', definition: 'a part of someone\'s character that is different from the rest of their character', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'patch', de: 'Flecken', definition: 'a small area of something that is different from the area around it', group: 'Gruppe 12', collection: 'First vocabulary' },
  { en: 'intensify', de: 'sich verstärken, sich intensivieren', definition: 'to increase in degree or strength, or to make something do this', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'psychological', de: 'psychologisch', definition: 'relating to the way that your mind works and the way that this affects your behaviour', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'lentil', de: 'Linse', definition: 'a small round seed like a bean, dried and used for food', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'weakness', de: 'Schwäche', definition: 'the state of being physically weak', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'evidence', de: 'Beweis, Nachweis', definition: 'facts or signs that show clearly that something exists or is true', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'unintended', de: 'unbeabsichtigt', definition: 'something which is not planned or done on purpose or deliberately', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'caffeine', de: 'Koffein', definition: 'a substance in tea, coffee, and some other drinks that makes you feel more active', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'fingers crossed', de: 'die Daumen drücken', definition: 'to hope that something will happen the way you want', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'modify', de: 'verändern, anpassen', definition: 'to make small changes to something in order to improve it and make it more suitable or effective', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'the wild', de: 'die Wildnis, die Natur', definition: 'in nature', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'bungee jump', de: 'Bungeesprung', definition: 'a sport in which you jump off something very high with a long length of special rope that stretches tied to your legs, so that you go up again without touching the ground', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'streaming', de: 'Streaming', definition: 'playing sound or video on your device directly from the Internet, rather than downloading and saving it as a file and then playing it', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'poverty', de: 'Armut', definition: 'the situation or experience of being poor', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'reality', de: 'Wahrheit', definition: 'what actually happens or is true, not what is imagined or thought', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'according to', de: 'zufolge, gemäß', definition: 'as shown by something or stated by someone', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'promoter', de: 'Veranstalter/in, Organisator/in, Promoter/in', definition: 'someone who arranges and advertises concerts or sports events', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'be in a temper', de: 'schlechter Laune sein', definition: 'be angry', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'claim', de: 'behaupten', definition: 'to state that something is true, even though it has not been proved', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'boredom', de: 'Langeweile', definition: 'the feeling you have when you are bored, or the quality of being boring', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'road rage', de: 'aggressive Fahrweise', definition: 'violence and angry behaviour by car drivers towards other car drivers', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'bear any relation to', de: 'einen Bezug haben zu', definition: 'to be similar to someone or something else', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'remarkably', de: 'bemerkenswert', definition: 'in an amount or to a degree that is unusual or surprising', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'bustling', de: 'belebt, betriebsam', definition: 'a bustling place is very busy', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'funding', de: 'finanzielle Unterstützung, Förderung', definition: 'money that is provided by an organization for a particular purpose', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'promenader', de: 'Spaziergänger/in', definition: 'someone who likes a leisurely walk, taken in a public place so as to meet or be seen by others', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'rough', de: 'unruhig', definition: 'when connected to the weather or sea, with strong winds or storms', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'demanding', de: 'anspruchsvoll, fordernd, anstrengend', definition: 'needing a lot of ability, effort, or skill', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'have something in common', de: 'etwas gemeinsam haben', definition: 'to have the same interests or opinions as someone else', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'lazy', de: 'faul', definition: 'not liking work and physical activity, or not making any effort to do anything', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'publicity', de: 'öffentliche Aufmerksamkeit, Publicity', definition: 'the attention that someone or something gets from newspapers, television, etc.', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'weighty', de: 'gewichtig', definition: 'important and serious', group: 'Gruppe 13', collection: 'First vocabulary' },
  { en: 'toss a coin', de: 'eine Münze werfen', definition: 'to throw a coin in the air, so that a decision will be made depending on which side faces upwards when it lands', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'nurture', de: 'aufziehen, ziehen', definition: 'to help a plan, idea, feeling, thing etc., to develop', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'provided that', de: 'vorausgesetzt, dass', definition: 'used to say that something will only be possible if something else happens or is done', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'with any luck', de: 'mit etwas Glück', definition: 'you say this if things happen in the way that you want', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'expand', de: 'sich ausdehnen', definition: 'to become larger in size, number, or amount, or to make something become larger', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'cultural event', de: 'kulturelle Veranstaltung', definition: 'an event relating to an artistic or social theme', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'equivalent', de: 'Äquivalent', definition: 'having the same value, purpose, job, etc., as a person or thing of a different kind', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'obsession', de: 'Obsession, Besessenheit, Sucht', definition: 'an extreme unhealthy interest in something or worry about something, which stops you from thinking about anything else', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'regulate', de: 'regulieren', definition: 'to make a machine or your body work at a particular speed, temperature, etc.', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'be spared', de: 'verschont bleiben', definition: 'be saved from strain, discomfort, embarrassment or from a particular cause of it', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'enforced', de: 'erzwungen, verstärkt', definition: 'made to happen, especially by things you cannot control', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'witty', de: 'geistreich', definition: 'using words in a clever and amusing way', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'obtain', de: 'bekommen, erhalten', definition: 'to get something that you want, especially through your own effort, skill, or work', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'brief spell', de: 'kurze Zeit', definition: 'a short period of time', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'protein', de: 'Protein', definition: 'one of several natural substances that exist in food such as meat, eggs, and beans, and which your body needs in order to grow and remain strong and healthy', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'stream', de: 'Strom, Zustrom', definition: 'a long and continuous series of events, people, objects, etc.', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'considerate', de: 'aufmerksam', definition: 'always thinking of what other people need or want and being careful not to upset them', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'fund', de: 'Fonds', definition: 'an amount of money that is collected and kept for a particular purpose', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'specialise in', de: 'sich spezialisieren auf', definition: 'to limit all or most of your study, etc., business, etc., to a particular subject or activity', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'letdown', de: 'Enttäuschung, Reinfall', definition: 'an event, performance, etc., that is not as good as you expected it to be', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'uninspiring', de: 'uninspirierend', definition: 'not at all interesting or exciting', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'estimate', de: 'schätzen', definition: 'to try to judge the value, size, speed, cost, etc., of something, without calculating it exactly', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'take risks', de: 'Risiken eingehen', definition: 'to continue with an action which might be dangerous', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'chew', de: 'kauen', definition: 'to bite food several times before swallowing it', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'opinionated', de: 'rechthaberisch', definition: 'expressing very strong opinions about things', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'last', de: 'letzter', definition: 'most recent or nearest to the present time', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'plateau', de: 'Plateau, Hochebene', definition: 'a large area of flat land that is higher than the land around it', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'cling to', de: 'festhalten an', definition: 'to continue to believe or do something, even though it may not be true or useful any longer', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'defendant', de: 'Angeklagte/r', definition: 'the person in a court of law who has been accused of doing something illegal', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'osteoporosis', de: 'Osteoporose', definition: 'a medical condition in which your bones become weak and break easily', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'harsh', de: 'hart', definition: 'harsh conditions are difficult to live in and very uncomfortable', group: 'Gruppe 14', collection: 'First vocabulary' },
  { en: 'trial', de: 'Prozess', definition: 'a legal process in which a judge and often a jury in a court of law examine information to decide whether someone is guilty of a crime', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'economist', de: 'Ökonom, Wirtschaftler', definition: 'someone who studies the way in which money and goods are produced and used and the systems of business and trade', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'commuter', de: 'Pendler/in', definition: 'someone who travels a long distance to work every day', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'blow (sb\'s) mind', de: 'jmd umwerfen', definition: 'to make you feel very surprised and excited by something', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'volunteer programme', de: 'Freiwilligenprogram m', definition: 'a program where most, if not all, of the work is done by volunteers (= people who do a job willingly without being paid)', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'uncharacteristically', de: 'untypischerweise', definition: 'not typical of someone or something and therefore surprising', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'sacrifice', de: 'Opfer', definition: 'when you decide not to have something valuable, in order to get something that is more important', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'single-minded', de: 'zielstrebig', definition: 'someone who is single-minded has one clear aim and works very hard to achieve it', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'preserve', de: 'erhalten, bewahren', definition: 'to save something or someone from being harmed or destroyed', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'correct yourself', de: 'sich korrigieren', definition: 'to change something you have said so it is true or correct', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'encourage', de: 'Mut machen, ermutigen', definition: 'to give someone the courage or confidence to do something', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'take after (sb)', de: 'jmd ähneln, nach jmd kommen', definition: 'to look or behave like an older relative', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'contrast', de: 'Gegensatz', definition: 'a difference between people, ideas, situations, things, etc., that are being compared', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'on offer', de: 'im Angebot', definition: 'available to be bought, chosen, or used', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'freedom', de: 'Freiheit', definition: 'the right to do what you want without being controlled or restricted by anyone', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'in that respect', de: 'in dieser Hinsicht', definition: 'in this respect refers back to an idea or point previously expressed in a statement', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'fulfil', de: 'erfüllen', definition: 'if you fulfil a hope, wish, or aim, you achieve the thing that you hoped for, wished for, etc.', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'now and again', de: 'hin und wieder', definition: 'sometimes', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'tell (sb) off', de: 'jmd anschnauzen, rügen', definition: 'to tell someone officially that something they have done is very wrong', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'endure', de: 'dauern, währen', definition: 'to continue to exist for along time', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'hit upon', de: 'auf etwas kommen', definition: 'to have an idea or discover something suddenly or unexpectedly (also "hit on")', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'struggle', de: 'kämpfen, sich abquälen', definition: 'to try extremely hard to achieve something, even though it is very difficult', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'be racing', de: 'rasen', definition: 'if your heart or mind is racing, it is working harder and faster than usual, for example because you are afraid or excited.', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'creator', de: 'Erfinder/in', definition: 'someone who made or invented a particular thing', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'lose touch with (sb/st)', de: 'den Kontakt verlieren zu', definition: 'if you lose touch with a situation or group, you are then no longer involved in it and so do not know about it or understand it', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'revolutionary', de: 'revolutionär', definition: 'completely new and different, especially in a way that leads to great improvements', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'junk food', de: 'Junkfood, Fraß', definition: 'food that is not healthy, for example because it contains a lot of fat, sugar, etc.', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'gadget', de: 'Gerät', definition: 'a small, useful, and cleverly-designed machine or tool', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'overhear', de: 'mithören, aufschnappen', definition: 'to accidentally hear what other people are saying, when they do not know that you have heard', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'intelligence', de: 'Intelligenz', definition: 'the ability to learn, understand, and think about things', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'kidney', de: 'Niere', definition: 'one of the two organs in your lower back that separate waste products from your blood and make urine.', group: 'Gruppe 15', collection: 'First vocabulary' },
  { en: 'bury', de: 'vergraben', definition: 'to cover or hide something', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'charm', de: 'Charme', definition: 'a special quality someone or something has that makes people like them, feel attracted to them, or be easily influenced by them – used to show approval', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'broke', de: 'pleite', definition: 'having no money', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'oversimplify', de: 'übermäßig vereinfachen', definition: 'to describe something in a way that is too simple and ignores many facts', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'recruit', de: 'einstellen, anwerben', definition: 'to find new people to work in a company, join an organization, do a job, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'pull yourself together', de: 'sich zusammenreißen', definition: 'to force yourself to stop behaving in a nervous, frightened, or uncontrolled way', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'nutrient', de: 'Nährstoff', definition: 'a chemical or food that provides what is needed for plants or animals to live and grow', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'untranslatable', de: 'unübersetzbar', definition: 'not able to be put into another form, language or style', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'pity', de: 'bemitleiden', definition: 'to feel sorry for someone because they are in a very bad situation', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'recommend', de: 'empfehlen', definition: 'to advise someone to do something, especially because you have special knowledge of a situation or subject', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'impact', de: 'Auswirkung', definition: 'the effect or influence that an event, situation, etc., has on someone or something', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'strike', de: 'Streik', definition: 'a period of time when a group of workers deliberately stop working because of a disagreement about pay, working conditions, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'characteristic', de: 'typisch, charakteristisch', definition: 'a quality or feature of something or someone that is typical of them and easy to recognize', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'survival skills', de: 'Überlebenskünste', definition: 'a set of skills that will help you to continue to live or exist after an accident, war, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'doubt', de: 'Zweifel', definition: 'a feeling of being not sure whether something is true or right', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'silver screen', de: 'Leinwand', definition: 'the film industry, especially in Hollywood', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'rehabilitate', de: 'rehabilitieren', definition: 'to help someone to live a healthy, useful, or active life again after they have been seriously ill or in prison', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'consumption', de: 'Verbrauch', definition: 'the amount of energy, oil, electricity, etc., that is used', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'rise', de: 'ansteigen', definition: 'to increase in number, amount, or value', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'line-up', de: 'Line-up, Aufstellung, auftretende Künstler', definition: 'a group of people, especially performers, who are involved in an event', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'mild-mannered', de: 'freundlich gestimmt, sanft', definition: 'gentle and polite', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'stroke of genius', de: 'Geniestreich', definition: 'Something done in an excellent or creative way', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'up and running', de: 'in Betrieb', definition: 'if a system is up and running, it has just started to work', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'ambitious', de: 'ehrgeizig', definition: 'determined to be successful, rich, powerful, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'initial', de: 'Anfangs-, Erst-', definition: 'happening at the beginning', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'investor', de: 'Investor/in', definition: 'someone who gives money to a company, business, or bank in order to get a profit', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'break into', de: 'eindringen in', definition: 'to become involved in a new job or business activity', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'lend', de: 'leihen', definition: 'to let someone borrow money or something that belongs to you for a short time', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'project', de: 'Projekt', definition: 'a carefully planned piece of work to get information about something, to build something, to improve something, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'raw', de: 'roh', definition: 'not cooked', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'severe', de: 'schlimm, rau, schlecht', definition: 'severe weather is very bad and very extreme, and very hot, dry, cold, etc.', group: 'Gruppe 16', collection: 'First vocabulary' },
  { en: 'ensure', de: 'sicherstellen', definition: 'to make certain that something will happen properly', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'pesticide', de: 'Pestizid', definition: 'a chemical substance used to kill insects and small animals that destroy crops', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'inhibit', de: 'stören, behindern', definition: 'to prevent something from growing or developing well', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'contact lens', de: 'Kontaktlinse', definition: 'a small round piece of plastic that you put on your eye to help you see clearly', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'subsidise', de: 'subventionieren', definition: 'if a government or organization subsidises a company, activity, etc., it pays part of its costs', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'extended family', de: 'erweiterte Familie, Großfamilie', definition: 'a family group that consists not only of parents and children but also of grandparents, aunts, etc.', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'cure', de: 'heilen', definition: 'to make an illness or medical condition go away', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'self-destructive', de: 'selbstzerstörerisch', definition: 'deliberately doing things that are likely to seriously harm or kill yourself', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'samurai', de: 'Samurai', definition: 'a member of a powerful military class in Japan in the past', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'practical', de: 'praktisch', definition: 'relating to real situations and events rather than ideas, emotions, etc.', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'independent', de: 'unabhängig', definition: 'an independent organization is not owned or controlled by, or does not receive money from, another organization or the government', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'uninhabited', de: 'unbewohnt', definition: 'an uninhabited place does not have anyone living there', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'go ahead with (st)', de: 'loslegen, beginnen mit etwas', definition: 'to start to do something, especially after planning it or asking permission to do it', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'optician', de: 'Optiker/in', definition: 'someone who tests people’s eyes and sells glasses in a shop', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'time-consuming', de: 'zeitaufwändig', definition: 'taking a long time to do', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'locker', de: 'Spind', definition: 'a small cupboard with a lock in a school, sports building, office, etc., where you can leave clothes or possessions while you do something', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'form', de: 'sich bilden, entstehen', definition: 'to start to exist, or make something start to exist, especially as the result of a natural process', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'tell tales', de: 'petzen', definition: 'to tell someone in authority about something wrong that someone else has done', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'genre', de: 'Genre', definition: 'a particular type of art, writing, music, etc., which has certain features that all examples of this type share', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'engage', de: 'fesseln, wachhalten', definition: 'to attract someone\'s attention and keep them interested', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'force', de: 'Kraft', definition: 'something or someone who is powerful and has a lot of influence on the way things happen', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'blend', de: 'vermengen, mischen', definition: 'to thoroughly mix together soft or liquid substances to form a single smooth substance', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'unconventional', de: 'unkonventionell', definition: 'very different from the way people usually behave, think, dress, etc.', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'invest', de: 'investieren', definition: 'to buy shares, property, or goods because you hope that the value will increase and you can make a profit', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'achieve', de: 'erreichen, erzielen', definition: 'to successfully complete something or get a good result, especially by working hard', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'dried-up', de: 'ausgetrocknet', definition: 'without water or moisture – completely dry', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'reliant on', de: 'abhängig von', definition: 'dependent on someone or something', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'implicitly', de: 'stillschweigend', definition: 'suggesting or understood without being stated directly', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'equally', de: 'ebenso, gleichermaßen', definition: 'to the same degree or amount', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'indicate', de: 'auf etwas hinweisen', definition: 'to show that a particular situation exists, or that something is likely to be true', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'efficiency', de: 'Effizienz', definition: 'the quality of doing something well and effectively, without wasting time, money, or energy', group: 'Gruppe 17', collection: 'First vocabulary' },
  { en: 'practice', de: 'Praktik', definition: 'to be the usual and accepted way of doing something', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'break away', de: 'weglaufen, sich lossagen', definition: 'to leave your home, family, or job and become independent', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'modest', de: 'bescheiden', definition: 'someone who is modest does not want to talk about their abilities or achievements', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'benefit from', de: 'profitieren von, Nutzen ziehen aus', definition: 'if you benefit from something, it gives you an advantage, improves your life or helps you in some way', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'convince', de: 'überzeugen', definition: 'to make someone feel certain that something is true', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'well-being', de: 'Wohlbefinden', definition: 'a feeling of being comfortable, healthy, and happy', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'marketing', de: 'Marketing', definition: 'the activity of deciding how to advertise a product, what price to charge for it, etc., or the type of job in which you do this', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'factual', de: 'faktenbasiert', definition: 'based on facts or relating to facts', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'excel', de: 'sich hervortun in', definition: 'to do something very well, or much better than most people', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'diagonally', de: 'diagonal', definition: 'following a sloping angle', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'advent', de: 'Ankunft, Aufkommen', definition: 'the time when something first begins to be widely used', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'passive', de: 'passiv', definition: 'someone who is passive tends to accept things that happen to them or things that people say to them, without taking any action', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'widen the appeal', de: 'die Attraktivität vergrößern', definition: 'to make more attractive and popular', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'cause', de: 'verursachen', definition: 'to make something happen, especially something bad', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'idealise', de: 'idealisieren', definition: 'a British spelling of idealize (= to imagine or represent something or someone as being perfect or better than they really are)', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'characterise', de: 'auszeichnen, kennzeichnen', definition: 'to describe the qualities of someone or something in a particular way', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'entrepreneur', de: 'Unternehmer/in', definition: 'someone who starts a new business or arranges business deals in order to make money, often in a way that involves financial risks', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'tough going', de: 'zäh, schwierig', definition: 'difficult', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'miner', de: 'Minenarbeiter', definition: 'someone who works under the ground in a mine to remove coal, gold, etc.', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'spot', de: 'entdecken, erblicken', definition: 'to notice someone or something, especially when they are difficult to see or recognize', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'bother', de: 'sich die Mühe machen', definition: 'to make the effort to do something', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'messily', de: 'unordentlich', definition: 'making someone or something dirty or untidy', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'bring about', de: 'herbeiführen', definition: 'to make something happen', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'knelt', de: 'kniete', definition: 'the past tense and past participle of kneel', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'jealousy', de: 'Eifersucht', definition: 'a feeling of being jealous', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'slice', de: 'durchschneiden', definition: 'to cut something easily with one movement of a sharp knife or edge', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'pay back', de: 'zurückzahlen', definition: 'to give someone the same amount of money that you borrowed from them', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'launch', de: 'starten', definition: 'to start something, usually something big or important', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'age gap', de: 'Altersunterschied', definition: 'the difference in age between two people', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'alter', de: 'sich verändern', definition: 'to change, or to make someone or something change', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'relatively', de: 'relativ', definition: 'something that is relatively small, easy, etc., is fairly small, easy, etc., compared to other things', group: 'Gruppe 18', collection: 'First vocabulary' },
  { en: 'sympathy', de: 'Sympathie, Mitgefühl, Verständnis', definition: 'the feeling of being sorry for someone who is in a bad situation', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'padlock', de: 'Verhängeschloss', definition: 'a lock that you can put on a gate, door, bicycle, etc.', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'applause', de: 'Applaus', definition: 'the sound of many people hitting their hands together and shouting, to show that they have enjoyed something', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'unaffected', de: 'nicht betroffen', definition: 'not changed or influenced by something', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'addictive', de: 'süchtig machend', definition: 'if a substance, especially a drug, is addictive, your body starts to need it regularly and you are unable to stop taking it', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'paralyze', de: 'lähmen', definition: 'if something paralyses you, it makes you lose the ability to move part or all of your body, or to feel it', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'rocket science', de: 'Raketentechnologie', definition: 'used to say that something is not difficult to do or understand', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'courage', de: 'Mut', definition: 'the quality of being brave when you are facing a difficult or dangerous situation, or when you are very ill', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'first-born', de: 'Erstgeborene/r', definition: 'your first child', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'damp', de: 'feucht', definition: 'slightly wet, often in an unpleasant way', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'privileged', de: 'privilegiert', definition: 'having advantages because of your wealth, social position, etc.', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'dramatic', de: 'dramatisch, erheblich', definition: 'great and sudden', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'sympathetic', de: 'verständnisvoll, mitfühlend', definition: 'caring and feeling sorry about someone’s problems', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'signal', de: 'erkennen lassen, signalisieren', definition: 'to make something clear by what you say or do – used in news reports', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'complex', de: 'komplex', definition: 'consisting of many different parts and often difficult to understand', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'dizzy', de: 'schwindlig', definition: 'feeling unable to stand steadily, for example because you are looking down from a high place or because you are ill', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'moody', de: 'launisch, mürrisch', definition: 'annoyed or unhappy', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'critic', de: 'Kritiker', definition: 'someone whose job is to make judgments about the good and bad qualities of art, music, films, etc.', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'twist', de: 'verstauchen', definition: 'to hurt your wrist etc by pulling or turning it too suddenly while you are moving', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'throw yourself in at the deep end', de: 'ins kalte Wasser springen', definition: 'to choose to do or be made to do a very difficult job without having prepared for it', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'get (sb) down', de: 'runterziehen, fertigmachen', definition: 'to make someone feel unhappy and tired', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'strength', de: 'Kraft', definition: 'the physical power and energy that makes someone strong', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'still life', de: 'Stillleben', definition: 'a picture of an arrangement of objects, for example flowers or fruit', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'base', de: 'sich niederlassen', definition: 'to have your main place of work, business, etc., in a particular place', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'inherit', de: 'erben', definition: 'to receive money, property, etc., from someone after they have died', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'increasingly', de: 'zunehmend', definition: 'more and more all the time', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'face', de: 'ertragen, entgegensehen, gegenüberstehen', definition: 'if you face or are faced with a difficult situation, it is going to affect you and you must deal with it', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'adventurous', de: 'waghalsig, kühn', definition: 'not afraid of taking risks or trying new things', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'ultra', de: 'ultra', definition: 'extremely', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'moving', de: 'bewegend', definition: 'making you feel strong emotions, especially sadness or sympathy', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'get it', de: 'verstehen', definition: 'to understand something', group: 'Gruppe 19', collection: 'First vocabulary' },
  { en: 'cell', de: 'Zelle', definition: 'the smallest part of a living thing that can exist independently', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'fate', de: 'Schicksal', definition: 'the things that happen to someone or something, especially unpleasant things that end their existence or end a particular period', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'drama', de: 'Spielfilm', definition: 'a play for the theatre, television, radio, etc., usually a serious one, or plays in general', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'interwar', de: 'Zwischenkriegs-', definition: 'happening or relating to the period between the First and the Second World Wars', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'affect', de: 'betreffen', definition: 'to do something that produces an effect or change in something or in someone’s situation', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'stay in touch', de: 'in Kontakt bleiben', definition: 'to keep writing or talking to someone, even though you do not see them very often', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'obey', de: 'gehorchen', definition: 'to do what someone in authority tells you to do, or what a law or rule says you must do', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'cute', de: 'niedlich', definition: 'very pretty or attractive', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'log on', de: 'sich anmelden', definition: 'to do the necessary actions on a computer system that will allow you to begin using it', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'grab', de: 'packen, ergreifen', definition: 'to take hold of someone or something with a sudden or violent movement', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'confused', de: 'durcheinander, verwirrt', definition: 'unable to understand or think clearly about what someone is saying or what is happening', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'impoverished', de: 'verarmt', definition: 'reduced to poverty', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'unimaginative', de: 'fantasielos', definition: 'lacking the ability to think of new or unusual ideas', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'robotics', de: 'Robotik', definition: 'the study of how robots are made and used', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'situational comedy', de: 'Situationskomödie', definition: 'abbreviated to sitcom, is a type of comedy focusing on a fixed set of characters and what happens to them', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'desert island', de: 'verlassene Insel', definition: 'a small tropical island that is far away from other places and has no people living on it', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'emotion', de: 'Emotion', definition: 'a strong human feeling such as love, hate, or anger', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'theme', de: 'Thema', definition: 'the main subject or idea in a piece of writing, speech, film, etc.', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'self-esteem', de: 'Selbstbewusstsein', definition: 'the feeling of being satisfied with your own abilities, and that you deserve to be liked or respected', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'split up', de: 'sich trennen', definition: 'if people split up, or if someone splits them up, they end a marriage or relationship with each other', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'medical', de: 'Medizin-', definition: 'relating to medicine and the treatment of disease or injury', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'additional', de: 'zusätzlich', definition: 'more than what was agreed or expected', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'setting', de: 'Umgebung', definition: 'the place where something is or where something happens, and the general environment', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'extract', de: 'Extrakt', definition: 'a substance obtained from something by using a special process', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'motivation', de: 'Motivation', definition: 'eagerness and willingness to do something without needing to be told or forced to do it', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'compass', de: 'Kompass', definition: 'an instrument that shows directions and has a needle that always points north', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'assembly line', de: 'Montageband', definition: 'a system for making things in a factory in which the products move past a line of workers who each make or check one part', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'financing', de: 'Finanzierung', definition: 'to provide money, especially a lot of money, to pay for something', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'get into (st)', de: 'sich mit etwas beschäftigen', definition: 'to begin to enjoy something or be interested in it', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'serving', de: 'Portion', definition: 'an amount of food that is enough for one person', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'short-lived', de: 'kurzlebig', definition: 'existing or happening for only a short time', group: 'Gruppe 20', collection: 'First vocabulary' },
  { en: 'fear', de: 'fürchten', definition: 'to feel afraid or worried that something bad may happen', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'maintain', de: 'beibehalten, aufrechterhalten', definition: 'to make something continue in the same way or at the same standard as before', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'uplifting', de: 'aufbauend, erhebend', definition: 'making you feel happier and more hopeful', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'concoction', de: 'Gebräu', definition: 'something, especially a drink or food, made by mixing different things, especially things that are not usually combined', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'capable (of)', de: 'fähig, in der Lage zu', definition: 'having the qualities or ability needed to do something', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'spoiled', de: 'verwöhnt', definition: 'a spoilt or spoiled person, especially a child, is rude and behaved badly because they have always been given what they want and allowed to do what they want', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'consume', de: 'zu sich nehmen', definition: 'to eat or drink something', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'take out', de: 'aufnehmen (Kredit)', definition: 'make a financial or legal arrangement with a bank, company, law court, etc.', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'survival', de: 'Überleben', definition: 'the state of continuing to live or exist', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'seafront', de: 'Strandpromenade', definition: 'the part of a town where the shops, houses, etc., are next to the beach', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'immunity', de: 'Immunität', definition: 'the state or right of being protected from particular laws or from unpleasant things', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'threatening', de: 'bedrohlich', definition: 'likely to harm or destroy something or someone', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'tend to do (st)', de: 'dazu neigen, etw zu tun', definition: 'if something tends to happen, it happens often and is likely to happen again', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'qualify', de: 'sich qualifizieren', definition: 'to have the right to have or do something, or to give someone this right', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'spotlight', de: 'Strahler, Spotlight', definition: 'a light with a very bright beam which can be directed at someone or something. Spotlights are often used to light a stage when actors or singers are performing', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'side effect', de: 'Begleiterscheinung, Nebenwirkung', definition: 'an unexpected or unplanned result of a situation or event', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'baking-hot', de: 'brütend heiß', definition: 'really hot', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'fraud', de: 'Betrug', definition: 'the crime of deceiving people in order to gain something such as money or goods', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'cybercrime', de: 'Cyberkriminalität', definition: 'criminal activity that involves the use of computers or the Internet', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'retrain', de: 'umschulen', definition: 'to learn or to teach someone the skills that are needed to do a different job', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'go off', de: 'hochgehen, explodieren', definition: 'to explore or fire', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'hotspot', de: 'Hotspot', definition: 'a place in a public building where there is a computer system with an access point, which allows people in the building with a wireless computer a blue-tooth mobile phone to connect to a service such as the Internet', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'prospects', de: 'Aussichten, Perspektive', definition: 'chances of future success or opportunities', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'cosy', de: 'behaglich, gemütlich', definition: 'a place that is cosy is small, comfortable and warm', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'crevasse', de: 'Spalt, Gletscherspalte', definition: 'a deep open crack in the thick ice on a mountain', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'stunning', de: 'umwerfend', definition: 'extremely attractive or beautiful', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'perfection', de: 'Perfektion', definition: 'the state of being perfect', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'carry on', de: 'fortfahren, weitermachen', definition: 'to continue doing something', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'free-time', de: 'Freizeit', definition: 'spare time you use for hobbies and other activities you enjoy', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'mixed feelings', de: 'gemischte Gefühle', definition: 'if you have mixed feelings about something, you are not sure whether you like, agree with, or feel happy about it', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'flock', de: 'strömen, herbeiströmen', definition: 'if people flock to a place, they go there in large numbers because something interesting or exciting is happening there', group: 'Gruppe 21', collection: 'First vocabulary' },
  { en: 'have the travel bug', de: 'Reisefieber haben', definition: 'to become very interested in travelling', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'judge', de: 'Richter', definition: 'the official in control of a court, who decides how criminals should be punished', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'free', de: 'befreien, freilassen', definition: 'to allow someone to leave prison or somewhere they have been kept as a prisoner', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'disadvantaged', de: 'benachteiligt', definition: 'having social problems, such as a lack of money or education, which make it difficult for you to succeed', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'scary', de: 'beängstigend', definition: 'frightening', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'inaccessible', de: 'unerreichbar', definition: 'difficult or impossible to reach', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'security', de: 'Sicherheit', definition: 'things that are done to keep a person, building, or country safe from danger or crime', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'live up to (sb\'s) expectations', de: 'jmds Erwartungen erfüllen', definition: 'if something or someone lives up to your expectations, they live up the standards or did as well as they were expected to do', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'brutal', de: 'brutal', definition: 'very cruel and violent', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'generation gap', de: 'Generationenkonfli kt', definition: 'the lack of understanding or the differences between older people and younger people', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'spurt', de: 'spritzen, lecken', definition: 'if liquid or flames spurt from something, they come out of it quickly and suddenly', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'positive', de: 'positiv', definition: 'if you are positive about things, you are hopeful and confident, and think about what is good in a situation rather than what is bad', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'spectacle', de: 'Spektakel', definition: 'a very impressive show or scene', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'selfie', de: 'Selfie', definition: 'a photograph, usually posted on social media, taken with a smartphone or digital camera where the person taking it is in the photograph', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'get by', de: 'zurechtkommen', definition: 'to have enough money to buy the things you need, but no more', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'holographic', de: 'holografisch,dreidi mensional', definition: 'relating to a hologram (= a kind of photograph made with a laser that looks 3D when looked at from an angle)', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'chink', de: 'Spalt', definition: 'a small hole in a wall, or between two things that join together, that lets light or air through', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'thrill-seeker', de: 'Adrenalinsüchtige/r', definition: 'someone who does things that are dangerous because they like the feeling of excitement it gives them', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'treasure', de: 'Schatz', definition: 'a group of valuable things such as gold, silver, jewels, etc.', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'relate to', de: 'zusammenhängen mit', definition: 'if two things relate to each other, they are connected in some way', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'accessible', de: 'erreichbar, zugänglich', definition: 'a place, building, or object that is accessible is easy to reach or get into', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'long-term', de: 'langfristig', definition: 'continuing for a long period of time, or relating to what will happen in the distant future', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'predate', de: 'zurückdatieren, zeitlich vorangehen', definition: 'to happen or exist earlier in history than something else', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'cope', de: 'zurechtkommen', definition: 'to succeed in dealing with a difficult problem or situation', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'towering', de: 'hoch aufragend', definition: 'very tall', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'gym', de: 'Fitnessstudio', definition: 'a special building or room that has equipment for doing physical exercise', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'update', de: 'Aktualisierung', definition: 'the most recent news or information about something', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'come through', de: 'etwas überstehen', definition: 'to continue to live, be strong, or succeed after a difficult or dangerous time', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'initially', de: 'ursprünglich, zuerst', definition: 'at the beginning', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'treat', de: 'behandeln', definition: 'to behave towards someone or something in a particular way', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'financial commitment', de: 'finanzielle Verpflichtung', definition: 'an amount of money that you have to pay regularly', group: 'Gruppe 22', collection: 'First vocabulary' },
  { en: 'work off', de: 'abbauen', definition: 'to get rid of something, especially a feeling such as anger, nervousness, etc., by doing something that uses a lot of your energy', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'version', de: 'Version', definition: 'a copy of something that has been changed so that it is slightly different', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'job security', de: 'Arbeitsplatzsicherh eit', definition: 'how permanent your job is likely to be', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'geyser', de: 'Geysir', definition: 'a natural spring that sends hot water and steam suddenly into the air from a hole in the ground', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'surround sound', de: 'Surround-Sound, Raumklang', definition: 'a system of four or more speakers (=pieces of equipment that sound comes out of) used so that sounds from a film or television programme come from all directions', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'anticipatory', de: 'vorwegnehmend, erwartungsvoll', definition: 'to expect that something will happen and be ready for it', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'strategy', de: 'Strategie', definition: 'a planned series of actions for achieving something', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'calculate', de: 'berechnen', definition: 'to find out how much something will cost, how long something will take, etc., by using numbers', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'commit', de: 'begehen', definition: 'to do something wrong or illegal', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'consider', de: 'betrachten, ansehen', definition: 'to think of someone or something in a particular way or to have a particular opinion', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'devoted', de: 'treu', definition: 'giving someone or something a lot of love and attention', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'marathon', de: 'Marathon', definition: 'a long race of about 26 miles or 42 kilometres', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'supporting', de: 'unterstützend, begleitend', definition: 'facts or data showing that an idea or statement is correct', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'be lost without', de: 'verloren sein ohne', definition: 'to not feel confident about what to do or how to behave', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'downside', de: 'Nachteil', definition: 'the negative part or disadvantage of something', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'rod', de: 'Stange', definition: 'a long thin pole or bar', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'legal', de: 'legal', definition: 'if something is legal, you are allowed to do it or have to do it by law', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'navigation equipment', de: 'Navigationsausrüst ung', definition: 'devices or equipment which help to show position, location, distance travelled and direction', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'hit on (st)', de: 'kommen auf', definition: 'to have an idea or discover something suddenly or unexpectedly', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'decade', de: 'Jahrzehnt', definition: 'a period of 10 years', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'based', de: 'sein Büro haben in, niedergelassen sein', definition: 'if you are based somewhere, that is the place where you work or where your main business is', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'loyalty', de: 'Treue, Loyalität', definition: 'the quality of remaining faithful to your friends, principles, country, etc.', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'charity', de: 'Wohltätigkeitsorga nisation', definition: 'an organization that gives money, goods, or help to people who are poor, sick, etc.', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'solid', de: 'fest', definition: 'hard or firm, with a fixed shape, and not a liquid or gas', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'see eye to eye', de: 'einer Meinung sein', definition: 'if two people see eye to eye, they agree with each other', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'relieved', de: 'erleichtert', definition: 'feeling happy because you are no longer worried about something', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'satisfying', de: 'befriedigend', definition: 'making you feel pleased and happy, especially because you have got what you wanted', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'mind-numbing', de: 'todlangweilig', definition: 'if an event or experience is mind-numbing, it is so bad, boring or great that you cannot think clearly about it', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'satisfaction', de: 'Befriedigung', definition: 'a feeling of happiness or pleasure because you have achieved something or got what you wanted', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'wear off', de: 'nachlassen, abklingen', definition: 'if pain or the effect of something wears off, it gradually stops', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'disloyalty', de: 'Illoyalität', definition: 'doing or saying things that do not support your friends, your country, or the group you belong to', group: 'Gruppe 23', collection: 'First vocabulary' },
  { en: 'lonelier', de: 'einsamer', definition: 'the comparative form of lonely (= unhappy because you are alone or because you have no friends)', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'isolated', de: 'isoliert', definition: 'an isolated building, village, etc., is far away from any others', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'set eyes on (sb/st)', de: 'etwas zu Gesicht bekommen', definition: 'to see something or meet someone, especially for the first time', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'tone', de: 'Ton', definition: 'the way your voice sounds, which shows how you are feeling or what you mean', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'stage fright', de: 'Lampenfieber', definition: 'nervousness felt by someone who is going to perform in front of a lot of people', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'décor', de: 'Dekor', definition: 'the way that the inside of a building is decorated', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'destiny', de: 'Schicksal', definition: 'the things that will happen to someone in the future, especially those that cannot be changed or controlled', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'abandon', de: 'aufgeben', definition: 'to stop having a particular idea, belief or attitude', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'impressive', de: 'beeindruckend', definition: 'something that is impressive makes you admire it because it is very good, large, important, etc.', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'fatigue', de: 'Müdigkeit, Erschöpfung', definition: 'very great tiredness', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'desire', de: 'Wunsch, Wille', definition: 'a strong hope or wish', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'inevitable', de: 'unvermeidbar', definition: 'certain to happen and impossible to avoid', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'justified', de: 'gerechtfertigt', definition: 'having an acceptable explanation or reason', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'work out', de: 'gelingen, gut gehen, sich lösen', definition: 'if a problem or complicated situation works out, it gradually gets better or gets solved', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'match made in heaven', de: 'perfektes Paar', definition: 'a marriage of two people who are exactly right for each other', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'exercise', de: '(Körper-)Training', definition: 'physical activities that you do in order to stay healthy and become stronger', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'nip into', de: 'kurz vorbeischauen', definition: 'to go somewhere quickly or for a short time', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'firm', de: 'Firma, Unternehmen', definition: 'a business or company, especially a small one', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'come into', de: 'zu etwas kommen', definition: 'to receive money, land, or property from someone after they have died', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'pragmatic', de: 'pragmatisch', definition: 'dealing with problems in a sensible practical way instead of strictly following a set of ideas', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'realistic', de: 'realistisch', definition: 'judging and dealing with situations in a practical way according to what is actually possible rather than what you would like to happen', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'deny', de: 'leugnen', definition: 'to say that something is not true, or that you do not believe something', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'sibling', de: 'Geschwister', definition: 'a brother or sister', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'far-fetched', de: 'weit hergeholt', definition: 'extremely unlikely to be true or to happen', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'uncontrollable', de: 'unkontrollierbar', definition: 'if an emotion, desire, or physical action is uncontrollable, you cannot control it or stop yourself from feeling it or doing it', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'feast', de: 'Feier, Fest', definition: 'a large meal where a lot of people celebrate a special occasion', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'portray', de: 'porträtieren, darstellen', definition: 'to describe or show someone or something in a particular way, according to your opinion of them', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'device', de: 'Gerät', definition: 'a machine or tool that does a special job', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'heat', de: 'erwärmen, erhitzen', definition: 'to make something become warm or hot', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'resolve', de: 'lösen', definition: 'to find a satisfactory way of dealing with a problem or difficulty', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'mutation', de: 'Mutation', definition: 'a change in the genetic structure of an animal or plant that makes it different from others of the same kind', group: 'Gruppe 24', collection: 'First vocabulary' },
  { en: 'breathtaking', de: 'atemberaubend', definition: 'very impressive, exciting, or surprising', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'react', de: 'reagieren', definition: 'to behave in a particular way or show a particular emotion because of something that has happened or been said', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'on demand', de: 'nach Bedarf', definition: 'whenever someone asks', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'superb', de: 'hervorragend', definition: 'extremely good', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'support (sb)', de: 'unterhalten, ernähren, unterstützen', definition: 'to provide enough money for someone to pay for all the things they need', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'mainstream', de: 'etabliert, massenkompatibel', definition: 'common or popular ideas or methods', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'overload', de: 'Überlastung, Überflutug', definition: 'too much of something', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'footstep', de: 'Schritt', definition: 'the sound each step makes when someone is walking', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'enlist', de: 'anwerben, anheuern', definition: 'to persuade someone to help you to do something', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'squeal', de: 'quieken', definition: 'to make a long loud high sound or cry', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'make up for', de: 'wieder gutmachen', definition: 'to make a bad situation better, or replace something that has been lost', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'personality', de: 'Persönlichkeit', definition: 'someone’s character, especially the way they behave towards other people', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'music', de: 'Musik', definition: 'a series of sounds made by instruments or voices in a way that is pleasant or exciting', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'put (sb/st) off', de: 'verschieben', definition: 'to delay doing something or to arrange to do something at a later date, especially because there is a problem or you do not want to do it now', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'imagery', de: 'Symbolik', definition: 'the use of words or pictures to describe ideas or actions in poems, books, films, etc.', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'host', de: 'Gastgeber sein', definition: 'to provide the place and everything that is needed for an organized event', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'take (sb) ages', de: 'ewig brauchen', definition: 'take a long time (to do something)', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'offend', de: 'beleidigen, verletzen', definition: 'to make someone angry or upset by doing or saying something that they think is rude, unkind, etc.', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'suit', de: 'stehen', definition: 'clothes, colours, etc., that suit you; make you look attractive', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'prospective', de: 'voraussichtlich', definition: 'someone who is likely to do a particular thing or achieve a particular position', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'cover for (sb)', de: 'vertuschen', definition: 'if you cover for or cover up for someone, you prevent them from getting into trouble by lying for them, especially about where they are or what they are doing', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'shameless', de: 'schamlos', definition: 'not seeming to be ashamed of your bad behaviour although other people think you should be ashamed', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'injure', de: 'verletzen', definition: 'to hurt yourself or someone else, for example in an accident or an attack', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'explorer', de: 'Entdecker', definition: 'someone who travels through an unknown area to find out about it', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'organic', de: 'biologisch, organisch', definition: 'relating to farming or gardening methods of growing food without using artificial chemicals, or produced or grown by these methods', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'helping hand', de: 'helfende Hand', definition: 'to give physical assistance to someone', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'irritating', de: 'nervig, ärgerlich', definition: 'an irritating habit, situation, etc., keeps annoying you', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'formal', de: 'formal', definition: 'done in a very organised way', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'review', de: 'Kritk, Besprechung', definition: 'an article in a newspaper or magazine that gives an opinion about a new book, play, film, etc.', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'neatly', de: 'ordentlich', definition: 'tidy and carefully arranged', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'economise', de: 'sparen', definition: 'to reduce the amount of money, time, goods, etc., that you use', group: 'Gruppe 25', collection: 'First vocabulary' },
  { en: 'forever', de: 'für immer', definition: 'for all future time', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'intervene', de: 'eingreifen', definition: 'to become involved in an argument, fight, or other difficult situation in order to change what happens', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'blogger', de: 'Blogger/in', definition: 'someone who writes about their experiences, opinions, etc., on a website, often with images and links to other sites', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'paraphrase', de: 'umschreiben, mit anderen Worten ausdrücken', definition: 'to express in a shorter, clearer, or different way what someone has said or written', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'reliability', de: 'Zuverlässigkeit', definition: 'someone or something that has reliability can be trusted or depended on', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'insist', de: 'bestehen auf', definition: 'to say firmly and often that something is true, especially when other people think it may not be true', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'cinematography', de: 'Filmkunst', definition: 'the skill or study of making films', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'right', de: 'Recht', definition: 'something you are morally, legally, or officially allowed to do or have', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'rapidly', de: 'rapide, schnell', definition: 'very quickly and in a very short time', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'affair', de: 'Angelegenheit', definition: 'public or political events and activities', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'donate', de: 'spenden', definition: 'to give something, especially money, to a person or an organization in order to help them', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'ignore', de: 'ignorieren', definition: 'to deliberately pay no attention to something that you have been told or that you know about', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'mature student', de: 'ältere/r Student/in', definition: 'a student at a university or college who is over 25 years old', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'fall', de: 'Sturz', definition: 'movement towards the ground or a lower position', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'heavy metal', de: 'Heavy Metal', definition: 'a type of rock music with a strong beat, played very loudly on electric guitars', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'level-headed', de: 'besonnen, vernünftig', definition: 'calm and sensible in making judgements or decisions', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'emerge', de: 'herauskommen', definition: 'to appear or come out from somewhere', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'overpriced', de: 'überteuert', definition: 'Something that is overpriced is more expensive than it should be', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'overall', de: 'gesamt', definition: 'considering or including everything', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'attribute', de: 'Eigenschaft', definition: 'a quality of feature, especially one that is considered to be good or useful', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'track (sb/st) down', de: 'ausfindig machen, aufspüren', definition: 'to find someone or something that is difficult to find by searching or looking for information in several different places', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'do away with', de: 'abschaffen', definition: 'to get rid of something or stop using it', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'fake', de: 'Fälschung', definition: 'a copy of a valuable object, painting, etc., that is meant to deceive people', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'come out', de: 'herauskommen', definition: 'if information comes out, people learn about it, especially after it has been kept secret', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'lucky charm', de: 'Glücksbringer', definition: 'a very small object worn on a chain or bracelet and believed to bring good luck', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'admire', de: 'bewundern', definition: 'to respect and like someone because they have done something that you think is good', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'tempting', de: 'verlockend', definition: 'something that is tempting seems very good and you would like to have it or do it', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'consistently', de: 'ständig, regelmäßig', definition: 'always behaving in the same way or having the same attitudes, standards, etc., – usually used to show approval', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'destructive', de: 'zerstörerisch', definition: 'causing damage to people or things', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'embrace', de: 'annehmen', definition: 'to eagerly accept a new idea, opinion, religion, etc.', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'theory', de: 'Theorie', definition: 'an idea or set of ideas that is intended to explain something about life or the world, especially an idea that has not yet been proved to be true', group: 'Gruppe 26', collection: 'First vocabulary' },
  { en: 'commitment', de: 'Verpflichtung', definition: 'a promise to do something or to behave in a particular way', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'consent', de: 'Erlaubnis, Zustimmung', definition: 'permission to do something', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'get round to', de: 'zu etwas kommen', definition: 'to do something that you have been intending to do for some time', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'wetsuit', de: 'Taucheranzug, Schwimmanzug', definition: 'a tight piece of clothing, usually made of rubber, worn by people who are swimming, surfing, etc., in the sea', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'expectation', de: 'Erwartung', definition: 'what you think or hope will happen', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'squeeze in', de: 'hineinzwängen', definition: 'to try to make something fit into a space that is too small, or to try to get into such a space', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'missile', de: 'Rakete', definition: 'a weapon that can fly over long distances and that explodes when it hits the thing it has been aimed at', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'paradise', de: 'Paradies', definition: 'a place or situation that is extremely pleasant, beautiful, or enjoyable', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'unrealistic', de: 'unrealistisch', definition: 'unrealistic ideas or hopes are not reasonable or sensible', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'cultivate', de: 'kultivieren', definition: 'to prepare and use land for growing crops and plants', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'counselling', de: 'Beratung', definition: 'advice and support given by a counsellor to someone with problems, usually after talking to them', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'norm', de: 'Norm', definition: 'the usual or normal situation, way of doing something, etc.', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'reward', de: 'belohnen', definition: 'to give something to someone because they have done something good or helpful or have worked for it', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'festival', de: 'Festival', definition: 'an occasion when there are performances of many films, plays, pieces of music, etc., usually happening in the same place every year', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'pacifism', de: 'Pazifismus', definition: 'the belief that war and violence are always wrong', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'socialise', de: 'verkehren, Umgang haben mit', definition: 'to spend time with other people in a friendly way', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'novel', de: 'neuartig', definition: 'not like anything known before, and unusual or interesting', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'civilization', de: 'Zivilisation', definition: 'a society that is well organized and developed, used especially about a particular society in a particular place or at a particular time', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'adrenaline', de: 'Adrenalin', definition: 'a chemical produced by your body when you are afraid, angry, or excited, which makes your heart beat faster', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'fictional', de: 'fiktional', definition: 'fictional people, events, etc., are imaginary and from a book or story', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'chip', de: 'Chip', definition: 'a small piece of silicon that has a set of complicated connections on it and is said to store and process information in computers', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'perfectionist', de: 'Perfektionist/in', definition: 'someone who is not satisfied with anything unless it is completely perfect', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'cater for', de: 'jmd versorgen, verpflegen', definition: 'to provide a particular group of people with the things they need or want', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'contradictory', de: 'widersprüchlich', definition: 'two statements, beliefs, etc., that are contradictory are different and therefore cannot both be true or correct', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'shared', de: 'gemeinsam', definition: 'if something is shared, it is enjoyed or used with other people so everyone can benefit from it', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'obsessive', de: 'besessen, zwanghaft', definition: 'thinking or worrying about something all the time, so that you do not think about other things enough – used to show disapproval', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'keep up with', de: 'mithalten mit', definition: 'if one process keeps up with another, it increases at the same speed and by the same amount', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'faux', de: 'falsch, unecht', definition: 'artificial, but made to look real', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'inaccurate', de: 'unzutreffend, ungenau', definition: 'not completely correct', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'overtime', de: 'Überstunden', definition: 'time that you spend working in your job in addition to your normal working hours', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'emptier', de: 'leerer', definition: 'more unhappy because nothing in your life seems interesting or important', group: 'Gruppe 27', collection: 'First vocabulary' },
  { en: 'better off', de: 'wohlhabender, bessergestellt', definition: 'having more money than someone else or than you had before', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'majority', de: 'Mehrheit', definition: 'most of the people or things in a group', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'value for money', de: 'Schnäppchen, gutes Preis- Leistungs- Verhältnis', definition: 'if something is value for money, it is well worth the money spent on it (= a bargain)', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'medallist', de: 'Medalliengewinner', definition: 'someone who has won a medal in a competition', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'put your foot down', de: 'ein Machtwort sagen', definition: 'to say very firmly that someone must do something or must stop doing something', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'endanger', de: 'gefährden', definition: 'to put someone or something in danger of being hurt, damaged, or destroyed', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'safeguard', de: 'schützen, absichern', definition: 'to protect something from harm or damage', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'pay rise', de: 'Gehaltserhöhung', definition: 'an increase in the amount of money you are paid for doing your job', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'enormity', de: 'Ungeheuerlichkeit', definition: 'the great size, seriousness, or difficulty of a situation, problem, event, etc.', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'determined', de: 'entschlossen, bestimmt', definition: 'having a strong desire to do something, so that you will not let anyone stop you', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'altitude sickness', de: 'Höhenkrankheit', definition: 'sickness that affects people at altitude (= at a great height above sea level)', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'thoughtful', de: 'rücksichtsvoll, umsichtig', definition: 'always thinking of the things you can do to make people happy or comfortable', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'voyeur', de: 'Voyeur', definition: 'someone who enjoys watching other people\'s private behaviour or suffering', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'call (st) off', de: 'absagen', definition: 'to decide that a planned event will not take place', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'in progress', de: 'im Gange', definition: 'happening now, and not yet finished', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'inspirational', de: 'inspirierend', definition: 'providing encouragement or new ideas for what you should do', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'rehearsal', de: 'Probe', definition: 'a time when all the people in a play, concert, etc., practise before a public performance', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'preoccupation', de: 'Sorge, Hauptsorge', definition: 'when someone thinks or worries about something a lot, with the result that they do not pay attention to other things', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'algae', de: 'Algen', definition: 'a very simple plant without stems or leaves that grows in or near water', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'imply', de: 'implizieren, andeuten', definition: 'to suggest that something is true, without saying this directly', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'calorie', de: 'Kalorie', definition: 'a unit for measuring the amount of energy that food will produce', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'migrant worker', de: 'Arbeitsmigrant', definition: 'someone who goes to live in another country for work', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'awareness', de: 'Bewusstsein, Kenntnis', definition: 'knowledge or understanding of a particular subject or situation', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'twin', de: 'Zwilling', definition: 'one of two children born at the same time to the same mother', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'transaction', de: 'Transaktion', definition: 'a business deal or action, such as buying or selling something', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'incapable', de: 'unfähig', definition: 'not able to do something', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'sob', de: 'schluchzen', definition: 'to cry noisily while breathing in short sudden bursts', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'mixture', de: 'Mischung', definition: 'a combination of two or more different things, feelings, or types of people', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'in common', de: 'gemeinsam', definition: 'to share or have the same characteristics or experiences as someone else', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'fraudulent', de: 'betrügerisch', definition: 'intended to deceive people in an illegal way, in order to gain money, power, etc.', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'nutritious', de: 'nahrhaft', definition: 'food that is nutritious is full of the natural substances that your body needs to stay healthy or to grow properly', group: 'Gruppe 28', collection: 'First vocabulary' },
  { en: 'catch the public imagination', de: 'Das Publikum begeistern, fesseln', definition: 'to make people feel very interested and excited', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'criticism', de: 'Kritik', definition: 'remarks that say what you think is bad about someone or something', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'let (sb) down', de: 'jmd enttäuschen, hängen lassen', definition: 'to not do something that someone trusts or expects you to do', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'brother-in-law', de: 'Schwager', definition: 'the brother of your husband or wife', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'out-of-the-way', de: 'abgelegen', definition: 'an out-of-the-way place is in an area where there are few people', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'double', de: 'verdoppeln', definition: 'to become twice as big or twice as much, or to make something twice as big or twice as much', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'abstract', de: 'abstrakt', definition: 'based on general ideas or principles rather than specific examples or real events', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'annihilation', de: 'Vernichtung', definition: 'to destroy something or someone completely', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'timetabled', de: 'terminieren, einplanen', definition: 'planned to happen at a particular time in the future', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'precaution', de: 'Vorsichtsmaßnahm en', definition: 'something you do in order to prevent something dangerous or unpleasant from happening', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'sick with nerves', de: 'krank vor Lampenfieber', definition: 'incredibly nervous or anxious, enough to make you feel physically sick or nauseous', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'put (sb) up', de: 'jmd beherbergen', definition: 'to let someone stay in your house and give them meals', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'Be located', de: 'sich befinden, liegen', definition: 'to be in a particular position or place', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'appeal', de: 'Aufruf', definition: 'an urgent request for something important', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'venue', de: 'Veranstaltungsort', definition: 'a place where an organized meeting, concert, etc., takes place', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'take a year out', de: 'sich ein Jahr Auszeit nehmen', definition: 'to not continue to university immediately after finishing school but instead to take a year to travel, work, etc.,', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'graduation ceremony', de: 'Diplomfeier, Abschlussfeier', definition: 'a ceremony at which you receive a university degree or a diploma from an American high school', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'headliner', de: 'Headliner, Hauptband', definition: 'the main performer or band in a concert', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'release', de: 'freilassen', definition: 'to let someone go free, after having kept them somewhere', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'see (sb) off', de: 'wegbringen', definition: 'to go to an airport, train station, etc., to say goodbye to someone', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'legendary', de: 'legendär', definition: 'very famous and admired', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'mental block', de: 'Blackout', definition: 'a difficulty in remembering something or in understanding something', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'companionship', de: 'Gesellschaft', definition: 'when you are with someone you enjoy being with, and are not alone', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'dynasty', de: 'Dynastie', definition: 'a family of kings or other rulers whose parents, grandparents, etc., have ruled the country for many years', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'muscle', de: 'Muskel', definition: 'one of the pieces of flesh inside your body that you use in order to move, and that connect your bones together', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'completion', de: 'Fertigstellung', definition: 'the state of being finished', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'irresponsible', de: 'verantwortungslos', definition: 'doing careless things without thinking or worrying about the possible bad results', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'deal with', de: 'sich um etwas kümmern', definition: 'to take the necessary action, especially in order to solve a problem', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'cut off from', de: 'abgeschnitten von', definition: 'to be a long way from other places and be difficult to get to', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'car chase', de: 'Autojagd', definition: 'when a car is in quick pursuit of another', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'in public', de: 'in der Öffentlichkeit', definition: 'if you do something in public, you do it where anyone can see', group: 'Gruppe 29', collection: 'First vocabulary' },
  { en: 'obesity', de: 'Fettleibigkeit', definition: 'when someone is very fat in a way that is unhealthy', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'blind date', de: 'Verabredung mit einer/einem Unbekannten', definition: 'an arranged meeting between a man and woman who have not met each other before', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'switch off', de: 'ausschalten', definition: 'to turn off a machine, light, radio, etc., using a switch', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'stick with/to', de: 'etwas beibehalten', definition: 'to continue doing something the way you did or planned to do before', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'build into', de: 'integrieren, einbauen', definition: 'to make something a permanent part of a system, agreement, etc.', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'raft', de: 'Floß', definition: 'a flat floating structure, usually made of pieces of wood tied together, used as a boat', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'birth order', de: 'Geburtenfolge', definition: 'The order in which siblings are born', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'magnificent', de: 'wundervoll', definition: 'very good or beautiful, and very impressive', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'designer brand', de: 'Designermarke', definition: 'a make of clothing or a product which is popular and fashionable, relating to a particular designer/company', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'in reality', de: 'in Wahrheit, tatsächlich', definition: 'used to say that something is different from what people think', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'pop in', de: 'vorbeischauen', definition: 'to go somewhere quickly, suddenly or in a way that you did not expect', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'make (perfect) sense', de: 'Sinn machen', definition: 'to have a clear meaning and be easy to understand', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'account', de: 'Erzählung, Erklärung', definition: 'a written or spoken description that says what happens in an event or process', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'victim', de: 'Opfer', definition: 'someone who has been attacked, robbed, or murdered', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'logical', de: 'logisch', definition: 'seeming reasonable and sensible', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'phenomenon', de: 'Phänomen', definition: 'something that happens or exists in society, science, or nature, especially something that is studied because it is difficult to understand', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'job vacancy', de: 'freie Stelle', definition: 'a job that is still available for someone to start doing', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'desperate', de: 'verzweifelt', definition: 'willing to do anything to change a very bad situation, and not caring about danger', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'misunderstanding', de: 'Missverständnis', definition: 'a problem caused by someone not understanding a question, situation, or instruction correctly', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'implication', de: 'Implikation', definition: 'a possible future effect or result of an action, event, decision, etc.', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'prematurely', de: 'verfrüht, zu früh', definition: 'happening before the natural or proper time', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'founding father', de: 'Gründungsvater', definition: 'someone who begins something such as a new way of thinking, or a new organization', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'social class', de: 'soziale Schicht', definition: 'relating to your position in society, according to your job, family, wealth, etc.', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'decline', de: 'Rückgang', definition: 'a decrease in the quality, quantity, or importance of something', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'enviable', de: 'beneidenswert', definition: 'an enviable quality, position, or possession is good and other people would like to have it', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'copyright', de: 'Copyright, Urheberrecht', definition: 'the legal right to be the only producer or seller of a book, play, film, or record for a specific length of time', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'random', de: 'zufällig', definition: 'happening or chosen without any definite plan, aim, or pattern', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'schedule', de: 'Zeitplan', definition: 'a plan of what someone is going to do and when they are going to do it', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'rarity', de: 'Seltenheit', definition: 'to not happen or exist very often', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'embarrassed', de: 'verlegen', definition: 'feeling uncomfortable or nervous and worrying about what people think of you, for example because you have made a silly mistake, or because you have to talk or sing in public', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'trembling', de: 'zitternd', definition: 'shaking slightly in a way that you cannot control, especially because you are upset or frightened', group: 'Gruppe 30', collection: 'First vocabulary' },
  { en: 'restricted', de: 'begrenzt', definition: 'small or limited in size, area, or amount', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'heads or tails', de: 'Kopf oder Zahl', definition: 'said when deciding something, by asking someone which side of a coin they guess will be showing when you throw it in the air and it lands', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'concept', de: 'Konzept', definition: 'an idea of how something is, or how something should be done', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'I\'m really into', de: 'begeistert sein von', definition: 'to really like or enjoy something', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'avoid', de: 'vermeiden', definition: 'to prevent something bad from happening', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'belief', de: 'Glaube', definition: 'the feeling that something is definitely true or definitely exists', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'increase', de: 'wachsen', definition: 'if you increase something, or if it increases, it becomes bigger in amount, number, or degree', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'key', de: 'wichtig, entscheidend', definition: 'very important or necessary', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'turn back', de: 'umkehren', definition: 'to go back in the direction you came from, or to make someone or something do this', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'accounting', de: 'Rechnungswesen', definition: 'the profession or work of keeping or checking financial accounts, same as accountancy', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'avalanche', de: 'Lawine', definition: 'a large mass of snow, ice, and rocks that falls down the side of a mountain', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'occur', de: 'auftreten, vorkommen', definition: 'to happen', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'stage', de: 'Runde, Etappe', definition: 'one of the parts which something such as a competition or process is divided into', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'strengthen', de: 'stärker werden', definition: 'to become stronger or make something stronger', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'desirable', de: 'wünschenswert, erstrebenswert', definition: 'something that is desirable is worth having or doing', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'limitation', de: 'Begrenzung', definition: 'the act or process of controlling or reducing something', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'manage', de: 'leiten', definition: 'to direct or control a business or department and the people, equipment, and money involved in it', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'browser', de: 'Browser', definition: 'a computer program that finds information on the Internet and shows it on your computer screen', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'facilities', de: 'Einrichtung, Ausstattung', definition: 'rooms, equipment, or services that are provided for a particular purpose', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'situated', de: 'gelegen sein, sich befinden', definition: 'to be in a particular position or place', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'contrasting', de: 'kontrastierend', definition: 'two or more things that are contrasting are different from each other, especially in a way that is interesting or attractive', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'social media', de: 'soziale Medien', definition: 'websites and apps that people use to create or share content, or as a way to make friends or keep in touch with people they know', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'multimillionaire', de: 'Multimillionär', definition: 'someone who has many millions of pounds or dollars', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'make redundant', de: 'entlassen', definition: 'if you are made redundant, your employer no longer has a job for you', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'volcano', de: 'Vulkan', definition: 'a mountain with a large hole at the top, through which lava (=very hot liquid rock) is sometimes forced out', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'criticise', de: 'kritisieren', definition: 'to find fault with or judge something/someone negatively', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'tedious', de: 'langweilig, öde', definition: 'something that is tedious continues for a long time and is not interesting', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'hoverboard', de: 'Hoverboard', definition: 'a two-wheeled scooter which, like a skateboard, requires balance', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'indecisive', de: 'unentschieden', definition: 'unable to make clear decisions or choices', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'inspire', de: 'inspirieren', definition: 'to encourage someone by making them feel confident and eager to do something', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'lose weight', de: 'abnehmen', definition: 'to reduce your weight through exercise, diet, etc.', group: 'Gruppe 31', collection: 'First vocabulary' },
  { en: 'unfold', de: 'sich entwickeln', definition: 'if a story unfolds, or if someone unfolds it, it is told', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'band', de: 'Band', definition: 'a group of musicians, especially a group that plays popular music', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'keep up', de: 'weitermachen, beibehalten', definition: 'to continue doing something', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'almond', de: 'Mandel', definition: 'a flat pale nut with brown skin that tastes sweet, or the tree that produces these nuts', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'interactive', de: 'interaktiv', definition: 'an interactive computer program, television system, etc., allows you to communicate directly with it, and does things in reaction to your actions', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'unsociable', de: 'ungesellig', definition: 'not wanting to be with people or at a time which doesn\'t fit with people\'s usual routines', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'costume', de: 'Kostüm', definition: 'a set of clothes worn by an actor or by someone to make them look like something such as an animal, famous person, etc.', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'infect', de: 'infizieren, befallen', definition: 'if a virus infects your computer or memory device, it changes or destroys the information on it', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'reckless', de: 'rücksichtslos, fahrlässig', definition: 'not caring or worrying about the possible bad or dangerous results of your actions', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'role model', de: 'Vorbild', definition: 'someone whose behaviour, attitudes, etc., people try to copy because they admire them', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'bravery', de: 'Mut, Unerschrockenheit', definition: 'actions, behaviour, or an attitude that shows courage and confidence', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'fascinated', de: 'fasziniert', definition: 'extremely interested by something or someone', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'contender', de: 'Konkurrent/in', definition: 'someone or something that is in competition with other people or things', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'stand out', de: 'hervorstechen', definition: 'to be very easy to see or notice', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'mass', de: 'Masse', definition: 'a large amount of a substance which does not have a definite or regular shape', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'attention seeker', de: 'jdm, der die Aufmerksamkeit anderer sucht', definition: 'someone who is trying to find or get attention from others', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'international relations', de: 'internationale Beziehungen', definition: 'the political relationships between countries, or the study of this', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'attraction', de: 'Anreiz, Verlockung', definition: 'a feature or quality that makes something seem interesting or enjoyable', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'cloud (sb\'s) judgement', de: 'das Urteilsvermögen trüben', definition: 'to make someone less able to think clearly or make sensible decisions', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'promotion', de: 'Beförderung', definition: 'a move to a more important job or position in a company or organization', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'ban', de: 'Verbot', definition: 'an official order that prevents something from being used or done', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'heatstroke', de: 'Hitzschlag', definition: 'fever and weakness caused by being outside in the heat of the sun for too long', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'seasonal', de: 'saisonal', definition: 'happening, expected, or needed during a particular season', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'self-reliance', de: 'Eigenständigkeit, Autarkie', definition: 'able to do or decide things by yourself, without depending on the help or advice of other people', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'suspect', de: 'den Verdacht haben, vermuten', definition: 'to think that something is probably true, especially something bad', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'ice age', de: 'Eiszeit', definition: 'any period of time during which glaciers covered a large area of the earth\'s surface', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'property', de: 'Eigenschaft', definition: 'a quality or power that a substance, plant, etc., has', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'research', de: 'untersuchen', definition: 'to study a subject in detail, especially in order to discover new facts or test new ideas', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'theoretically', de: 'theoretisch', definition: 'used to say what is supposed to be true in a particular situation, especially when the opposite is true', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'gig', de: 'Gig, bezahlter Auftritt', definition: 'a performance by a musician or a group of musicians, for e.g., playing modern popular music or jazz, or a performance by a comedian', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'inspiring', de: 'inspirierend', definition: 'giving people a feeling of excitement and a desire to do something great', group: 'Gruppe 32', collection: 'First vocabulary' },
  { en: 'yoga', de: 'Yoga', definition: 'a system of exercises that help you control your mind and body in order to relax', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'approval', de: 'Einverständnis, Zustimmung', definition: 'when a plan, decision, or person is officially accepted', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'digest', de: 'verdauen', definition: 'to change food that you have just eaten into substances that your body can use', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'take back', de: 'zurückbringen', definition: 'to return something you have bought to a shop because it is not suitable', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'assemble', de: 'sich versammeln', definition: 'if you assemble a large number of people or things, or if they assemble, they are gathered together in one place, often for a particular purpose', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'impatient', de: 'ungeduldig', definition: 'annoyed because of delays, someone else’s mistakes, etc.', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'not worth it', de: 'es nicht wert sein', definition: 'if something is not worth it, it\'s not important or useful to make an effort doing it', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'insight', de: 'Einblick', definition: 'a sudden clear understanding of something or part of something, especially a complicated situation or idea', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'arc', de: 'Bogen', definition: 'a curved shape or line', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'self-help', de: 'Selbsthilfe', definition: 'the use of your own efforts to deal with your problems, instead of depending on other people', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'confine to', de: 'beschränken auf', definition: 'to keep someone or something within the limits of a particular activity or subject', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'dependent on (sb/st)', de: 'abhängig von (etwas/jmd)', definition: 'to need the support, help or existence of someone or something in order to exist, be healthy, be successful, etc.', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'come across', de: 'zufällig finden', definition: 'to meet, find, or discover someone or something by chance', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'captain', de: 'Kapitän', definition: 'the sailor in charge of a ship, or the pilot in charge of an aircraft', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'go viral', de: 'sich schnell verbreiten', definition: 'if something, e.g. a video, image or story, goes viral, it spreads quickly and widely on the Internet through social media, etc.', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'vinyl', de: 'Vinyl, LP', definition: 'records, made of a strong type of plastic, played on a record player', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'mad about (sb/st)', de: 'verrückt nach', definition: 'to like someone or something very much', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'unique', de: 'einzigartig', definition: 'unusually good and special', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'similarity', de: 'Ähnlichkeit', definition: 'if there is a similarity between two things or people, they are similar in some way', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'network', de: 'miteinander verbinden', definition: 'to connect several computers together so that they can share information', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'scuba-dive', de: 'Schnorcheln', definition: 'the sport of swimming under water while breathing through a tube that is connected to a container of air on your back', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'miraculous', de: 'wundersam', definition: 'very good, completely unexpected, and often very lucky', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'superhuman', de: 'übermenschlich', definition: 'much greater than ordinary human powers or abilities', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'tranquil', de: 'ruhig', definition: 'pleasantly calm, quiet, and peaceful', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'gain', de: 'bekommen, erhalten', definition: 'to obtain or achieve something you want or need', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'package tour', de: 'Pauschalreise', definition: 'a holiday organised by a company at a fixed price that includes the cost of travel, hotel, etc.', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'package', de: 'verpacken', definition: 'to put food or other goods into a bag, box, etc., ready to be sold or sent', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'responsible', de: 'verantwortlich', definition: 'if someone is responsible for an accident, mistake, crime, etc., it is their fault or they can be blamed', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'crystal', de: 'Kristall', definition: 'very high quality clear glass', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'extravagant', de: 'übertrieben, extravagant', definition: 'spending or costing a lot of money, especially more than is necessary or more than you can afford', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'shelter', de: 'Unterschlupf', definition: 'a place to live, considered as one of the basic needs of life', group: 'Gruppe 33', collection: 'First vocabulary' },
  { en: 'abundance', de: 'Überfluss, Fülle, große Menge', definition: 'a large quantity of something', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'online', de: 'online', definition: 'connected to other computers through the Internet, or available through the Internet', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'domestic', de: 'Haus-, heimisch', definition: 'used in people\'s homes', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'stress', de: 'hervorheben, betonen', definition: 'to emphasize a statement, fact, or idea', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'troll', de: 'Troll, Provokateur', definition: 'a person who posts deliberately offensive or provocative (intended to make people upset or angry) posts online', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'fluently', de: 'fließend', definition: 'able to speak a language very well', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'secluded', de: 'versteckt, abgeschieden', definition: 'very private and quiet', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'stimulating', de: 'anregend', definition: 'exciting or full of new ideas', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'point of view', de: 'Perspektive, Blickwinkel', definition: 'a particular way of thinking about or judging a situation', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'doom', de: 'zum Scheitern verurteilen', definition: 'to make someone or something certain to fail, die, be destroyed, etc.', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'get your hands on', de: 'in die Hände bekommen', definition: 'to get something that you really want or that you have a lot of time looking for', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'witness', de: 'Zeuge/Zeugin', definition: 'someone who sees a crime or an accident and can describe what happened', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'affordable', de: 'bezahlbar', definition: 'to have enough money to buy or pay for something', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'bellow', de: 'brüllen', definition: 'to shout loudly in a deep voice', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'come up with', de: 'sich etwas ausdenken', definition: 'to think of an idea, answer, etc.', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'reaction', de: 'Reaktion', definition: 'your ability to move quickly when something dangerous happens suddenly', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'can’t stand', de: 'nicht ausstehen können', definition: 'to have a strong dislike for something or someone', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'hardly ever', de: 'kaum', definition: 'almost never', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'respond', de: 'reagieren auf, antworten', definition: 'to do something as a reaction to something that has been said or done', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'straightforward', de: 'unmissverständlich', definition: 'simple and easy to understand', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'enthusiasm', de: 'Begeisterung', definition: 'a strong feeling of interest and enjoyment about something and a keenness to be involved in it', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'threat', de: 'Drohung', definition: 'a statement in which you tell someone that you will cause them harm or trouble if they do not do what you want', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'deadline', de: 'Termin', definition: 'a date or time by which you have to do or complete something', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'regardless of', de: 'unabhängig von', definition: 'without being affected or influenced by something', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'state', de: 'Zustand', definition: 'the physical or mental condition that someone or something is in', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'expedition', de: 'Expedition', definition: 'a long and carefully organised journey, especially to a dangerous or unfamiliar place, or a group of people that make this journey', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'happen to do (st)', de: 'zufällig etw tun', definition: 'if you happen to do something, you do it by chance', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'confirm', de: 'bestätigen', definition: 'to show that something is definitely true, especially by providing more proof', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'mathematical formula', de: 'mathematische Formel', definition: 'a mathematical rule or principle, usually expressed in symbols', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'pessimist', de: 'Pessimist/in', definition: 'someone who always expects that bad things will happen', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'break down', de: 'eine Panne haben', definition: 'if a car or machine breaks down, it stops working', group: 'Gruppe 34', collection: 'First vocabulary' },
  { en: 'comfort', de: 'Bequemlichkeit', definition: 'a feeling of being physically relaxed and satisfied, so that nothing is hurting you, making you feel too hot or cold, etc.', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'blockbuster', de: 'Blockbuster', definition: 'a book or film that is very good or successful', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'ripe', de: 'reif', definition: 'ripe fruit or crops are fully grown and ready to eat', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'possession', de: 'Besitz', definition: 'something that you own or have with you at a particular time', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'prohibit', de: 'verbieten', definition: 'to say that an action is illegal or not allowed', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'monastery', de: 'Kloster', definition: 'a place where monks live', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'psychologist', de: 'Psychologe/Psychol ogin', definition: 'someone who is trained in psychology', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'violent', de: 'heftig, brutal, stark', definition: 'a physical feeling or reaction that is very painful or difficult to control', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'combination', de: 'Kombination', definition: 'two or more different things that exist together or are used or put together', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'exotic', de: 'exotisch', definition: 'something that is exotic seems unusual and interesting because it is related to a foreign country – use this to show approval', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'polar bear', de: 'Eisbär', definition: 'a large white bear that lives near the North Pole', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'stepfather', de: 'Stiefvater', definition: 'a man who is married to your mother but who is not your natural father', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'go to almost any lengths', de: 'zu allem bereit sein', definition: 'to try very hard or do whatever is necessary to achieve something that is important (to you)', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'runway', de: 'Startbahn, Landebahn', definition: 'a long specially prepared hard surface like a road on which aircraft land and take off', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'crush', de: 'fertigmachen', definition: 'to make someone lose all hope, confidence, etc.', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'fly the nest', de: 'das Nest verlassen', definition: 'if a young bird flies the nest, it has grown old enough to look after itself and is no longer dependent on its parents', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'send (sb) spinning', de: 'jmd aus der Bahn werfen', definition: 'if you send someone spinning, you make them feel dizzy or faint because they are shocked or excited', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'in triumph', de: 'triumphierend', definition: 'with a feeling of success of victory at completing or achieving something', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'gift', de: 'Gabe, Talent', definition: 'a natural ability or talent', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'spread your wings', de: 'seine Flügel ausbreiten', definition: 'to start to have an independent life and experience new things', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'the outside world', de: 'die Außenwelt', definition: 'the rest of the world', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'luxurious', de: 'luxuriös', definition: 'very expensive, beautiful, and comfortable', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'astonishing', de: 'erstaunlich', definition: 'so surprising that it is difficult to believe', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'build up', de: 'sich ansammeln, aufstauen', definition: 'if a feeling builds up, or if you build it up, it increases gradually over a period of time', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'generosity', de: 'Großzügigkeit', definition: 'a generous attitude, or generous behaviour (= willing to give money, spend time to help someone, etc.)', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'brake', de: 'bremsen', definition: 'to make a vehicle or bicycle go more slowly or stop by using its brake(s)', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'by chance', de: 'zufällig', definition: 'the way some things happen without being planned or caused by people', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'acquit', de: 'freisprechen', definition: 'to give a decision in a court of law that someone is not guilty of a crime', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'weird', de: 'seltsam, merkwürdig', definition: 'very strange and unusual, and difficult to understand or explain', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'genuine', de: 'echt, wahr', definition: 'something genuine really is what it seems to be', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'ambition', de: 'Ehrgeiz, Ziel', definition: 'a strong desire to achieve something', group: 'Gruppe 35', collection: 'First vocabulary' },
  { en: 'match', de: 'Spiel (Sport)', definition: 'an organized sports event between two teams or people', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'broaden the mind', de: 'den Horizont erweitern', definition: 'helps you to increase your knowledge or something', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'function', de: 'Funktion', definition: 'the purpose that something has, or the job that someone or something does', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'hammer-throw', de: 'Hammerwerfen', definition: 'a sport in athletics in which a hammer (attached to a metal wire) is thrown for distance from a specific starting point using two hands', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'controversial', de: 'umstritten', definition: 'causing a lot of disagreement, because many people have strong opinions about the subject being discussed', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'reinforce', de: 'untermauern, stützen', definition: 'to give support to an opinion, idea, or feeling, and make it stronger', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'stand on your own feet', de: 'auf eigenen Füßen stehen', definition: 'to be able to do what you need to do, earn your own money, etc., without help from others', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'queue', de: 'sich anstellen, Schlange stehen', definition: 'to form or join a line of people or vehicles waiting to do something or go somewhere', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'obligation', de: 'Verpflichtung, Pflicht', definition: 'a moral or legal duty to do something', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'token', de: 'Alibi', definition: 'someone who is included in a group to make everyone think that the group has all types of people in it, when this is not really true.', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'kingdom', de: 'Königreich', definition: 'a country ruled by a king or queen', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'fantasy', de: 'Fantasie, Vorstellung', definition: 'an exciting and unusual experience or situation you imagine happening to you, but which will probably never happen', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'fixed', de: 'festgelegt', definition: 'fixed times, amounts, meanings, etc., cannot be changed', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'profitable', de: 'profitabel', definition: 'producing a profit or a useful result', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'strict', de: 'streng', definition: 'expecting people to obey rules or to do what you say', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'tragic', de: 'tragisch', definition: 'a tragic event or situation makes you feel very sad, especially because it involves death or suffering', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'dominate', de: 'dominieren', definition: 'to control someone or something or to have more importance than other people or things', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'sand dune', de: 'Sanddüne', definition: 'a hill formed of sand in a desert or near the sea', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'crash', de: 'abstürzen', definition: 'an occasion when a computer or computer system suddenly stops working', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'counterproductive', de: 'kontraproduktiv', definition: 'achieving the opposite result to the one that you want', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'suffer', de: 'leiden', definition: 'to experience physical or mental pain', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'bunk', de: 'Koje', definition: 'a narrow bed that is attached to the wall, for example on a train or ship', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'sense', de: 'Gefühl', definition: 'a feeling about something', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'cheer up', de: 'bessere Laune bekommen', definition: 'to become less sad, or to make someone feel less sad', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'valuables', de: 'Wertsachen', definition: 'things that you own that are worth a lot of money, such as jewellery, cameras, etc.', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'globe', de: 'Globus', definition: 'a round object with a map of the Earth drawn on it', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'boundary', de: 'Grenze', definition: 'the real or imaginary line that marks the edge of a state, country, etc., or the edge of an area of land that belongs to someone', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'give up', de: 'aufgeben', definition: 'to stop trying to do something', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'jury', de: 'Geschworene', definition: 'a group of often 12 ordinary people who listen to the details of a case in court and decide whether someone is guilty or not', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'natural state', de: 'Naturzustand', definition: 'without additions, in a pure form as from nature', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'conservation', de: 'Schutz, Erhaltung', definition: 'the protection of natural things such as animals, plants, forests, etc., to prevent them from being spoiled or destroyed', group: 'Gruppe 36', collection: 'First vocabulary' },
  { en: 'allegedly', de: 'angeblich', definition: 'used when reporting something that people say is true, although it has not been proved', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'set up', de: 'gründen', definition: 'to start a company, organization, committee, etc.', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'linked to', de: 'verbunden mit', definition: 'if two things are linked, they are related in some way', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'absence', de: 'Fehlen, Abwesenheit', definition: 'the lack of something or the fact that it does not exist', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'stumble across', de: 'stoßen auf', definition: 'to find or discover something by chance and unexpectedly', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'surgery', de: 'Arztpraxis', definition: 'a place where a doctor or dentist gives treatment', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'dissatisfaction', de: 'Unzufriedenheit', definition: 'a feeling of not being satisfied', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'observe', de: 'beobachten', definition: 'to see and notice something', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'thrilled', de: 'aufgeregt, begeistert', definition: 'very excited, happy, and pleased', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'whatsoever', de: 'gar nichts', definition: 'used to emphasize a negative statement', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'take up', de: 'annehmen', definition: 'to accept a suggestion, offer or idea', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'intervention', de: 'Intervention', definition: 'the act of becoming involved in an argument, fight, or other difficult situation in order to change what happens', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'computer game', de: 'Computerspiel', definition: 'a game that is played on a computer', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'spacious', de: 'geräumig', definition: 'a spacious house, room, etc., is large and has plenty of space to move around in', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'encouragement', de: 'Ermutigung', definition: 'when you encourage someone or something, or the things that encourage them', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'slight chance', de: 'geringe Möglichkeit', definition: 'a small possibility of something happening', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'hybrid', de: 'Hybrid', definition: 'an animal or plant produced from parents of different breeds or types', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'accomplish', de: 'erreichen', definition: 'to succeed in doing something, especially after trying very hard', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'relevant', de: 'relevant, wichtig', definition: 'directly relating or linked to the subject or problem being discussed or considered', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'directly', de: 'direkt', definition: 'with no other person, action, process, etc., between', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'put on probation', de: 'mit Bewährung', definition: 'when a criminal is given a set period of time (by a judge) during which they must behave well and not commit any more crimes, in order to not be sent to prison', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'insular', de: 'Insel-', definition: 'if a something or someone is insular, it is isolated or separate from its surroundings', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'Yours faithfully', de: 'Mit freundlichen Grüßen', definition: 'the usual polite way of ending a formal letter, which you have begun with Dear Sir/Madam', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'waste of money', de: 'Geldverschwendun g', definition: 'if something is a waste of money, it is not worth spending money on it as it has little or no value in return', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'unexplored', de: 'unentdeckt', definition: 'an unexplored place has not been examined or put on a map', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'superstitious', de: 'abergläubisch', definition: 'influenced by superstitions', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'construction', de: 'Bau, Errichtung', definition: 'the process of building things such as houses, bridges, roads, etc.', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'admiration', de: 'Bewunderung', definition: 'a feeling of great respect and liking for something or someone', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'taste', de: 'Geschmack', definition: 'the feeling that is produced by a particular food or drink when you put it in your mouth', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'have none of it', de: 'nichts davon wissen wollen', definition: 'used to say that someone refused to allow someone to do something or to behave in a particular way', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'strong-willed', de: 'willensstark', definition: 'knowing exactly what you want to do and being determined to achieve it, even if other people advise you against it', group: 'Gruppe 37', collection: 'First vocabulary' },
  { en: 'risk', de: 'Risiko', definition: 'the possibility that something bad, unpleasant, or dangerous may happen', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'opportunity', de: 'Gelegenheit', definition: 'a chance to do something or an occasion when it is easy for you to do something', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'outlook', de: 'Blick', definition: 'your general attitude to life and the world', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'broadcasting', de: 'Fernsehen und Rundfunk', definition: 'the business of making television and radio programmes', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'work ethic', de: 'Arbeitsethos', definition: 'a belief in the moral value and importance of work', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'discover by accident', de: 'zufällig entdecken', definition: 'to find something by chance', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'detached', de: 'distanziert, neutral', definition: 'not reacting to or becoming involved in something in an emotional way', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'conflict', de: 'Konflikt', definition: 'a state of disagreement or argument between people, groups, countries, etc.', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'be prepared to', de: 'bereit sein zu', definition: 'be willing to do something', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'clear', de: 'reinigen, befreien von', definition: 'to make somewhere emptier or tidier by removing things from it', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'shorthand', de: 'Kurzschrift', definition: 'a shorter but less clear way of saying something', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'speculate', de: 'spekulieren', definition: 'to guess about the possible causes or effects of something, without knowing all the facts or details', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'damaged', de: 'verletzt', definition: 'something that is damaged has been harmed or injured', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'ultimately', de: 'letztlich', definition: 'finally, after everything else has been done or considered', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'narcissistic', de: 'narzisstisch', definition: 'when someone is too concerned about their appearance or abilities or spends too much time admiring them – used to show disapproval', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'perfect', de: 'perfektionieren', definition: 'to make something as good as you are able to', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'protection', de: 'Schutz', definition: 'when someone or something is protected', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'hunk', de: 'Brocken, großes Stück', definition: 'a thick piece of something, especially food, that has been taken from a bigger piece', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'supportive', de: 'eine Stütze seiend', definition: 'giving help or encouragement, especially to someone who is in a difficult situation – used to show approval', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'wholesale business', de: 'Großhandel', definition: 'a business involved in the sale or goods to retailers, industrial commercial businesses, etc., – generally involved in the sale of goods to anyone other than standard consumers', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'guitar', de: 'Gitarre', definition: 'a musical instrument usually with six strings that you play by pulling the strings with your fingers or with a plectrum (= a small piece of plastic, metal, etc.)', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'worth the money', de: 'sein Geld wert sein', definition: 'if something is worth the money, it has value and the money was well spent', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'hypothetical', de: 'hypothetisch', definition: 'based on a situation that is not real, but that might happen', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'declining', de: 'schwindend, rückgängig', definition: 'to decrease in quantity or importance', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'replacement', de: 'Ersatz', definition: 'when you get something that is newer or better than the one you had before', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'passion', de: 'Leidenschaft', definition: 'a very strong liking for something', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'skid', de: 'schleudern, rutschen', definition: 'if a vehicle or wheel on a vehicle skids, it suddenly slides sideways and you cannot control it', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'flip', de: 'schnippen', definition: 'to move something with a quick sudden movement so that it is in a different position', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'lava', de: 'Lava', definition: 'hot liquid rock that flows from a volcano, or this rock when it has become solid', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'title', de: 'Titel', definition: 'the name given to a particular book, painting, play, etc.', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'first-rate', de: 'erstklassig', definition: 'of the very best quality', group: 'Gruppe 38', collection: 'First vocabulary' },
  { en: 'brush against', de: 'streifen über', definition: 'to touch someone or something lightly when passing them', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'identify', de: 'identifizieren', definition: 'to recognize and correctly name someone or something', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'permit', de: 'erlauben, gestatten', definition: 'to allow something to happen, especially by an official decision, rule, or law', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'lead to', de: 'führen zu', definition: 'to cause something to happen or cause someone to do something', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'wonderful', de: 'wunderbar', definition: 'very good and effective', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'genetic', de: 'genetisch', definition: 'relating to genes (= part of a cell in a living thing that controls what it looks like, how it grows, and how it develops.', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'boiling', de: 'kochend heiß', definition: 'very hot', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'live to regret (st)', de: 'etwas sein Leben lang bereuen', definition: 'if you live to regret something, you wish that it had not happened or that you had not done it', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'fragile', de: 'zerbrechlich', definition: 'easily broken or damaged', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'thankfully', de: 'zum Glück', definition: 'used to say that you are glad that something has happened, especially because a difficult situation has ended or been avoided', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'imaginary', de: 'imaginär', definition: 'not real, but produced from pictures or ideas in your mind', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'open doors', de: 'Türen öffnen', definition: 'to give an opportunity to someone to do something', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'respect', de: 'respektieren', definition: 'a feeling of admiring someone or what they do, especially because of their personal qualities, knowledge, or skills', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'divided', de: 'geteilt', definition: 'if something divides, or if you divide it, it separates into two or more parts', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'yacht', de: 'Yacht', definition: 'a large boat with a sail, used for pleasure or sport, especially one that has a place where you can sleep', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'summarise', de: 'zusammenfassen', definition: 'to make a short statement giving only the main information and not the details of a plan, event, report, etc.', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'drop out', de: 'verlassen, rausfliegen', definition: 'to leave a school or university before your course has finished', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'by choice', de: 'freiwillig', definition: 'if you do something by choice, you do it because you want to do it and not because you are forced to do it', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'ideal', de: 'ideal, Ideal-', definition: 'the best or most suitable that something could possibly be', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'fire', de: 'feuern', definition: 'to shoot bullets or bombs', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'mood', de: 'Stimmung, Laune', definition: 'the way you feel at a particular time', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'nutritionist', de: 'Ernährungsberater/ in', definition: 'someone who has a special knowledge of nutrition', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'distrustful', de: 'misstrauisch, skeptisch', definition: 'unable or unwilling to trust something or someone', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'negative', de: 'negativ', definition: 'harmful, unpleasant, or not wanted', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'release date', de: 'Datum der Veröffentlichung', definition: 'the date when a product, press release or news story will be made public', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'wander', de: 'spazieren, wandern', definition: 'to walk slowly across or around an area, usually without a clear direction or purpose', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'virtual', de: 'virtuell', definition: 'made, done or seen, etc., on the Internet or on a computer, rather than in the real world', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'community', de: 'Gemeinde', definition: 'the people who live in the same area, town, etc.', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'wireless networking', de: 'Funkvernetzung', definition: '(also known as Wi-Fi) a way of connecting computers or other electronic machines to a network by using radio signals rather than wires', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'cast', de: 'Besetzung (Film)', definition: 'all the people who perform in a play, film, etc.', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'insane', de: 'irrsinnig, verrückt', definition: 'completely stupid or crazy, often in a way that is dangerous', group: 'Gruppe 39', collection: 'First vocabulary' },
  { en: 'generation', de: 'Generation', definition: 'all people of about the same age', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'be limited to (st)', de: 'begenzt sein auf', definition: 'to exist or happen only in a particular place, group, or area of activity', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'burst with (st)', de: 'platzen vor etwas', definition: 'to have a lot of something or be filled with something, e.g. pride, energy, excitement', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'exploit', de: 'ausbeuten', definition: 'to treat someone unfairly by asking them to do things for you, but giving them very little in return – used to show disapproval', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'try', de: 'Versuch', definition: 'an attempt to do something', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'myth', de: 'Mythos', definition: 'an idea or story that many people believe, but which is not true', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'institution', de: 'Institution', definition: 'a large organization that has a particular kind of work or purpose', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'talk (sb) into (st)', de: 'jmd zu etw überreden', definition: 'to persuade someone to do something', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'carer', de: 'Pfleger/in, Betreuer/in', definition: 'someone who looks after an old or ill person at home', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'on the point of (st)', de: 'am Punkt angelangt … zu tun', definition: 'about to do something', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'counsellor', de: 'Berater', definition: 'someone whose job is to help and support people with problems', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'supernatural', de: 'übernatürlich', definition: 'impossible to explain by natural causes, and therefore seeming to involve the powers of gods or magic', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'reputation', de: 'Ruf, Ansehen', definition: 'the opinion that people have about someone or something because of what has happened in the past', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'be classed as', de: 'klassifiziert sein als', definition: 'to consider people, things, etc., as belonging to a particular group, using an official system', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'hyperactive', de: 'hyperaktiv', definition: 'someone, especially a child, who is hyperactive is too active, and is not able to keep still or be quiet for very long', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'merchandise', de: 'Waren, Produkte', definition: 'goods that are being sold', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'museum', de: 'Museum', definition: 'a building where important cultural, historical, or scientific objects are kept and shown to the public', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'come round to', de: 'nachgeben, sich überzeugen lassen', definition: 'to change your opinion so that you now agree with someone or are no longer angry with them', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'openly', de: 'offen', definition: 'in a way that does not hide your feelings, opinions, or the facts', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'close relationship', de: 'enges Verhältnis zu', definition: 'if you have a close relationship with someone you like or love each other very much', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'worsen', de: 'verschlimmern', definition: 'to become worse or make something worse', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'market trader', de: 'Markthändler', definition: 'someone who works on a market stall selling items', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'follow through', de: 'durchziehen, zu Ende bringen', definition: 'to do what needs to be done to complete something or make it successful', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'diagnose', de: 'diagnostizieren', definition: 'to find out what illness someone has, or what the cause of a fault is, after doing tests, examinations, etc.', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'wealthy', de: 'wohlhabend, reich', definition: 'having a lot of money, possessions, etc.', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'meaning', de: 'Bedeutung', definition: 'the thing or idea that a word, expression, or sign represents', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'professional', de: 'Experte, Profi', definition: 'someone who works in a job that needs special education and training, such as a doctor, lawyer, or architect', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'discourage', de: 'jmd abhalten, abraten von', definition: 'to persuade someone not to do something, especially by making it seem difficult or bad', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'acquire', de: 'erwerben, sich aneignen', definition: 'to gain knowledge or learn a skill', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'in the middle of nowhere', de: 'mitten im Nirgendwo', definition: 'a long way from the nearest big town', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'unnatural', de: 'unnatürlich', definition: 'different from what you would normally expect', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'regret', de: 'bedauern, bereuen', definition: 'to feel sorry about something you have done and wish you had not done it', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'fraudster', de: 'Betrüger/in', definition: 'someone who has committed a fraud', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'principle', de: 'Prinzip', definition: 'the basic idea that a plan or system is based on', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'working day', de: 'Arbeitstage', definition: 'a day of the week when most people work. In Britain and the US this is usually Monday to Friday', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'failure', de: 'Misserfolg', definition: 'a lack of success in achieving or doing something', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'thin on the ground', de: 'dünn gesät', definition: 'few in number, limited or scarce', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'applicant', de: 'Bewerber/in', definition: 'someone who has formally asked, usually in writing, for a job, university place, etc.', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'vulnerable', de: 'verletzlich', definition: 'someone who is vulnerable can be easily harmed or hurt', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'soothing', de: 'beruhigend', definition: 'to make someone feel calmer and less anxious, upset, or angry', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'get cold feet about (st)', de: 'kalte Füße bekommen wegen etw.', definition: 'to suddenly feel that you are not brave enough to do something you planned to do', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'fortune', de: 'Vermögen', definition: 'a very large amount of money', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'clubbing', de: 'abends ausgehen', definition: 'the activity of going to nightclubs', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'argumentative', de: 'streitlustig', definition: 'someone who is argumentative often argues or likes arguing', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'astronaut', de: 'Astronaut', definition: 'someone who travels and works in a spacecraft', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'productively', de: 'produktiv', definition: 'producing or achieving a lot', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'untouched', de: 'unberührt', definition: 'not changed, damaged, or affected in any way', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'chilly', de: 'kühl', definition: 'chilly weather or places are cold enough to make you feel uncomfortable', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'symptom', de: 'Symptom', definition: 'something wrong with your body or mind which shows that you have a particular illness', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'compare', de: 'vergleichen', definition: 'to consider two or more things or people, in order to show how they are similar or different', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'data', de: 'Daten', definition: 'information or facts', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'friend', de: 'Freund/in', definition: 'someone who you know and like very much, and enjoy spending time with', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'grip', de: 'packen', definition: 'to hold someone\'s attention and interest.', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'improve your chances', de: 'seine Chancen verbessern', definition: 'increase the likelihood of something happening', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'antivirus software', de: 'Anti-Virus-Software', definition: 'a type of software that looks for and removes viruses in programs and documents on your computer', group: 'Gruppe 40', collection: 'First vocabulary' },
  { en: 'consequence', de: 'Folge, Konsequenz', definition: 'something that happens as a result of a particular action or set of conditions', group: 'Gruppe 40', collection: 'First vocabulary' },
].map((w, i) => ({ id: `default_${i}`, en: w.en, de: w.de, definition: w.definition, group: w.group, collection: w.collection }));

// ─────────────────────────────────────────────────────────────
export default function App() {
  const [words, setWords]                   = useState([]);
  const [screen, setScreen]                 = useState('collections'); // 'collections'|'groups'|'session'|'done'
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeGroup, setActiveGroup]       = useState(null);
  const [mode, setMode]                     = useState('en-de');
  const [modeModal, setModeModal]           = useState(false);
  const [pendingGroup, setPendingGroup]     = useState(null);
  const [queue, setQueue]                   = useState([]);
  const [knownCount, setKnownCount]         = useState(0);
  const [totalCount, setTotalCount]         = useState(0);
  const [isFlipped, setIsFlipped]           = useState(false);
  const [hintVisible, setHintVisible]       = useState(false);
  const [hintWord, setHintWord]             = useState(null);
  const [groupStats, setGroupStats]         = useState({});
  // Add word modal
  const [addModal, setAddModal]             = useState(false);
  const [addPreGroup, setAddPreGroup]       = useState('');
  const [inputEn, setInputEn]               = useState('');
  const [inputDe, setInputDe]               = useState('');
  const [inputGroup, setInputGroup]         = useState('');
  // New collection modal
  const [newColModal, setNewColModal]       = useState(false);
  const [newColName, setNewColName]         = useState('');
  // Word list modal
  const [wordListModal, setWordListModal]   = useState(false);
  const [wordListGroup, setWordListGroup]   = useState('');

  const flipAnim = useRef(new Animated.Value(0)).current;
  const deRef    = useRef(null);
  const grpRef   = useRef(null);

  // ── Load / initialise ──────────────────────────────────
  useEffect(() => {
    (async () => {
      const initialized = await AsyncStorage.getItem(INIT_KEY);
      const stored      = await AsyncStorage.getItem(STORAGE_KEY);
      const existing    = stored ? JSON.parse(stored) : [];
      if (!initialized) {
        const merged = [
          ...DEFAULT_WORDS,
          ...existing.filter(w => !w.id?.startsWith('default_')),
        ];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        await AsyncStorage.setItem(INIT_KEY, '1');
        setWords(merged);
      } else {
        setWords(existing);
      }
      const statsRaw = await AsyncStorage.getItem(STATS_KEY);
      setGroupStats(statsRaw ? JSON.parse(statsRaw) : {});
    })();
  }, []);

  const saveWords = async (next) => {
    setWords(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // ── Derived data ───────────────────────────────────────
  const collections = useMemo(() => {
    const map = {};
    words.forEach(w => {
      const c = w.collection || 'Allgemein';
      const g = w.group || 'Allgemein';
      if (!map[c]) map[c] = { name: c, wordCount: 0, groups: new Set() };
      map[c].wordCount++;
      map[c].groups.add(g);
    });
    return Object.values(map).map(c => ({ name: c.name, wordCount: c.wordCount, groupCount: c.groups.size }));
  }, [words]);

  const groups = useMemo(() => {
    const map = {};
    words
      .filter(w => (w.collection || 'Allgemein') === activeCollection)
      .forEach(w => {
        const g = w.group || 'Allgemein';
        map[g] = (map[g] || 0) + 1;
      });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [words, activeCollection]);

  // ── Flip animation ─────────────────────────────────────
  const doFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8, tension: 10, useNativeDriver: true,
    }).start();
    setIsFlipped(f => !f);
  };
  const resetFlip = () => { flipAnim.setValue(0); setIsFlipped(false); };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  // ── Session control ────────────────────────────────────
  const openModeModal = (groupName) => {
    setPendingGroup(groupName);
    setModeModal(true);
  };

  const startSession = (selectedMode) => {
    const groupName  = pendingGroup;
    const gWords     = words.filter(w =>
      (w.collection || 'Allgemein') === activeCollection &&
      (w.group || 'Allgemein') === groupName
    );
    const shuffled = [...gWords].sort(() => Math.random() - 0.5);
    setMode(selectedMode);
    setActiveGroup(groupName);
    setQueue(shuffled);
    setKnownCount(0);
    setTotalCount(gWords.length);
    resetFlip();
    setModeModal(false);
    setScreen('session');
  };

  const restartSession = () => {
    setPendingGroup(activeGroup);
    setModeModal(true);
    setScreen('groups');
  };

  const markKnown = async () => {
    const next     = queue.slice(1);
    const newKnown = knownCount + 1;
    setKnownCount(newKnown);
    if (next.length === 0) {
      const key      = `${activeCollection}////${activeGroup}`;
      const newStats = { ...groupStats, [key]: (groupStats[key] || 0) + 1 };
      setGroupStats(newStats);
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      setScreen('done');
    } else { setQueue(next); resetFlip(); }
  };

  const markUnknown = () => {
    const [current, ...rest] = queue;
    setQueue([...rest, current]);
    resetFlip();
  };

  // ── Add word ───────────────────────────────────────────
  const openAddModal = (preGroup = '') => {
    setAddPreGroup(preGroup);
    setInputGroup(preGroup);
    setInputEn('');
    setInputDe('');
    setAddModal(true);
  };

  const addWord = () => {
    const en    = inputEn.trim();
    const de    = inputDe.trim();
    const group = inputGroup.trim() || 'Allgemein';
    const col   = activeCollection || 'Allgemein';
    if (!en || !de) return;
    saveWords([...words, { id: Date.now().toString(), en, de, definition: '', group, collection: col }]);
    setInputEn(''); setInputDe(''); setInputGroup(''); setAddPreGroup('');
    setAddModal(false);
  };

  const deleteWord = (id) => {
    Alert.alert('Löschen', 'Dieses Wort wirklich löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => saveWords(words.filter(w => w.id !== id)) },
    ]);
  };

  const deleteGroup = (groupName) => {
    const count = words.filter(w => (w.collection || 'Allgemein') === activeCollection && (w.group || 'Allgemein') === groupName).length;
    Alert.alert('Gruppe löschen', `"${groupName}" mit ${count} Wörtern wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () =>
        saveWords(words.filter(w => !((w.collection || 'Allgemein') === activeCollection && (w.group || 'Allgemein') === groupName)))
      },
    ]);
  };

  const deleteCollection = (colName) => {
    const count = words.filter(w => (w.collection || 'Allgemein') === colName).length;
    Alert.alert('Sammlung löschen', `"${colName}" mit ${count} Wörtern wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () =>
        saveWords(words.filter(w => (w.collection || 'Allgemein') !== colName))
      },
    ]);
  };

  const openWordList = (groupName) => {
    setWordListGroup(groupName);
    setWordListModal(true);
  };

  // ── Create collection ──────────────────────────────────
  const createCollection = () => {
    const name = newColName.trim();
    if (!name) return;
    // Add a placeholder word so the collection appears (or just navigate in)
    setActiveCollection(name);
    setNewColName('');
    setNewColModal(false);
    setScreen('groups');
  };

  // ══════════════════════════════════════════════════════
  // SCREEN: DONE
  // ══════════════════════════════════════════════════════
  if (screen === 'done') {
    const statKey = `${activeCollection}////${activeGroup}`;
    const doneCount = groupStats[statKey] || 0;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.doneWrap}>
          <Text style={styles.doneStar}>★</Text>
          <Text style={styles.doneTitle}>Geschafft!</Text>
          <Text style={styles.doneSub}>
            Alle {totalCount} Wörter aus{'\n'}"{activeGroup}" gewusst!
          </Text>
          <Text style={styles.doneCount}>{doneCount}× abgeschlossen</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={restartSession}>
            <Text style={styles.doneBtnText}>Nochmal üben</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneBtnGhost} onPress={() => setScreen('groups')}>
            <Text style={styles.doneBtnGhostText}>Zurück zur Gruppenübersicht</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════
  // SCREEN: SESSION
  // ══════════════════════════════════════════════════════
  if (screen === 'session') {
    const current   = queue[0];
    const progress  = totalCount > 0 ? knownCount / totalCount : 0;
    const frontLang = mode === 'en-de' ? 'Englisch' : 'Deutsch';
    const backLang  = mode === 'en-de' ? 'Deutsch'  : 'Englisch';
    const frontWord = mode === 'en-de' ? current?.en : current?.de;
    const backWord  = mode === 'en-de' ? current?.de : current?.en;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.sessHeader}>
          <TouchableOpacity onPress={() => setScreen('groups')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Zurück</Text>
          </TouchableOpacity>
          <Text style={styles.sessGroupName} numberOfLines={1}>{activeGroup}</Text>
          <View style={{ width: 70 }} />
        </View>

        <Text style={styles.modeBadge}>{mode === 'en-de' ? 'EN → DE' : 'DE → EN'}</Text>

        <View style={styles.progWrap}>
          <View style={styles.progTrack}>
            <View style={[styles.progFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progText}>{knownCount} / {totalCount} gewusst</Text>
        </View>

        <Text style={styles.queueInfo}>
          {queue.length} Wort{queue.length !== 1 ? 'e' : ''} in der Warteschlange
        </Text>

        <TouchableOpacity activeOpacity={0.95} onPress={doFlip} style={styles.cardArea}>
          <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontRotate }] }]}>
            <Text style={styles.cardLabel}>{frontLang}</Text>
            <Text style={styles.cardWord}>{frontWord ?? '—'}</Text>
            <Text style={styles.cardHint}>Tippen zum Umdrehen</Text>
          </Animated.View>
          <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backRotate }] }]}>
            <Text style={styles.cardLabel}>{backLang}</Text>
            <Text style={styles.cardWord}>{backWord ?? '—'}</Text>
            <Text style={styles.cardHint}>Tippen zum Umdrehen</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.hintBtn} onPress={() => { setHintWord(current); setHintVisible(true); }}>
          <Text style={styles.hintBtnText}>? Tipp anzeigen</Text>
        </TouchableOpacity>

        <Modal visible={hintVisible} transparent animationType="fade" onRequestClose={() => setHintVisible(false)}>
          <TouchableOpacity style={styles.hintOverlay} activeOpacity={1} onPress={() => setHintVisible(false)}>
            <View style={styles.hintBox}>
              <Text style={styles.hintWord}>{hintWord?.en}</Text>
              <Text style={styles.hintDef}>{hintWord?.definition}</Text>
              <Text style={styles.hintClose}>Tippen zum Schließen</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {isFlipped ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionWrong]} onPress={markUnknown}>
              <Text style={styles.actionIcon}>✕</Text>
              <Text style={styles.actionLabel}>Nicht gewusst</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionRight]} onPress={markKnown}>
              <Text style={styles.actionIcon}>✓</Text>
              <Text style={styles.actionLabel}>Gewusst</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRowPlaceholder}>
            <Text style={styles.flipHint}>Karte umdrehen, dann bewerten</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════
  // SCREEN: GROUPS (within a collection)
  // ══════════════════════════════════════════════════════
  if (screen === 'groups') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => setScreen('collections')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Zurück</Text>
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle} numberOfLines={1}>{activeCollection}</Text>
          <View style={{ width: 70 }} />
        </View>

        <FlatList
          data={groups}
          keyExtractor={item => item.name}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Gruppen</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => openAddModal('')}>
                <Text style={styles.addBtnText}>+ Wort</Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => openAddModal('')}>
              <Text style={styles.emptyAddBtnText}>+ Erstes Wort hinzufügen</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => {
            const statKey   = `${activeCollection}////${item.name}`;
            const doneCount = groupStats[statKey] || 0;
            return (
              <View style={styles.groupRow}>
                <TouchableOpacity style={styles.groupItem} onPress={() => openModeModal(item.name)}>
                  <View style={styles.groupLeft}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <Text style={styles.groupCount}>{item.count} Wörter</Text>
                    {doneCount > 0 && (
                      <Text style={styles.groupStat}>{doneCount}× abgeschlossen</Text>
                    )}
                  </View>
                  <Text style={styles.groupArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.groupAddBtn} onPress={() => openWordList(item.name)}>
                  <Text style={styles.groupAddBtnText}>≡</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.groupAddBtn} onPress={() => openAddModal(item.name)}>
                  <Text style={styles.groupAddBtnText}>+</Text>
                </TouchableOpacity>
                {activeCollection !== 'First vocabulary' && (
                  <TouchableOpacity style={styles.groupDelBtn} onPress={() => deleteGroup(item.name)}>
                    <Text style={styles.groupDelBtnText}>🗑</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />

        {/* Word List Modal */}
        <Modal visible={wordListModal} transparent animationType="slide" onRequestClose={() => setWordListModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { maxHeight: '80%' }]}>
              <View style={styles.wordListHeader}>
                <Text style={styles.modalTitle}>{wordListGroup}</Text>
                <TouchableOpacity onPress={() => setWordListModal(false)}>
                  <Text style={styles.wordListClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={words.filter(w =>
                  (w.collection || 'Allgemein') === activeCollection &&
                  (w.group || 'Allgemein') === wordListGroup
                )}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.wordListItem}>
                    <View style={styles.wordListPair}>
                      <Text style={styles.wordListEn}>{item.en}</Text>
                      <Text style={styles.wordListDe}>{item.de}</Text>
                    </View>
                    {activeCollection !== 'First vocabulary' && (
                      <TouchableOpacity onPress={() => deleteWord(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Text style={styles.groupDelBtnText}>🗑</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Keine Wörter in dieser Gruppe.</Text>}
              />
            </View>
          </View>
        </Modal>

        {/* Mode Selection Modal */}
        <Modal visible={modeModal} transparent animationType="fade" onRequestClose={() => setModeModal(false)}>
          <View style={styles.modeOverlay}>
            <View style={styles.modeBox}>
              <Text style={styles.modeTitle}>Lernrichtung wählen</Text>
              <Text style={styles.modeSub}>{pendingGroup}</Text>
              <TouchableOpacity style={styles.modeOption} onPress={() => startSession('en-de')}>
                <Text style={styles.modeOptionLang}>Englisch</Text>
                <Text style={styles.modeOptionArrow}>→</Text>
                <Text style={styles.modeOptionLang}>Deutsch</Text>
                <Text style={styles.modeOptionDesc}>Englisches Wort sehen, Deutsch erraten</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeOption, styles.modeOptionAlt]} onPress={() => startSession('de-en')}>
                <Text style={styles.modeOptionLang}>Deutsch</Text>
                <Text style={styles.modeOptionArrow}>→</Text>
                <Text style={styles.modeOptionLang}>Englisch</Text>
                <Text style={styles.modeOptionDesc}>Deutsches Wort sehen, Englisch erraten</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modeCancelBtn} onPress={() => setModeModal(false)}>
                <Text style={styles.modeCancelText}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Word Modal */}
        <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Wort hinzufügen</Text>
              {addPreGroup ? (
                <Text style={styles.modalGroupLabel}>Gruppe: {addPreGroup}</Text>
              ) : null}
              <TextInput
                style={styles.input} placeholder="Englisch" placeholderTextColor="#555"
                value={inputEn} onChangeText={setInputEn}
                returnKeyType="next" onSubmitEditing={() => deRef.current?.focus()} autoFocus
              />
              <TextInput
                ref={deRef} style={styles.input} placeholder="Deutsch" placeholderTextColor="#555"
                value={inputDe} onChangeText={setInputDe}
                returnKeyType={addPreGroup ? 'done' : 'next'}
                onSubmitEditing={addPreGroup ? addWord : () => grpRef.current?.focus()}
              />
              {!addPreGroup && (
                <>
                  <TextInput
                    ref={grpRef} style={styles.input} placeholder="Gruppe"
                    placeholderTextColor="#555" value={inputGroup} onChangeText={setInputGroup}
                    returnKeyType="done" onSubmitEditing={addWord}
                  />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                    {groups.map(g => (
                      <TouchableOpacity
                        key={g.name}
                        style={[styles.chip, inputGroup === g.name && styles.chipActive]}
                        onPress={() => setInputGroup(g.name)}
                      >
                        <Text style={[styles.chipText, inputGroup === g.name && styles.chipTextActive]}>{g.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => { setAddModal(false); setInputEn(''); setInputDe(''); setInputGroup(''); }}>
                  <Text style={styles.modalBtnCancelText}>Abbrechen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnAdd]} onPress={addWord}>
                  <Text style={styles.modalBtnAddText}>Hinzufügen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════
  // SCREEN: COLLECTIONS (top level)
  // ══════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Karteikarten</Text>

      <FlatList
        data={collections}
        keyExtractor={item => item.name}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Sammlungen</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setNewColModal(true)}>
              <Text style={styles.addBtnText}>+ Neu</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Noch keine Sammlungen.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.groupRow}>
            <TouchableOpacity
              style={[styles.colItem, { flex: 1 }]}
              onPress={() => { setActiveCollection(item.name); setScreen('groups'); }}
            >
              <View style={styles.groupLeft}>
                <Text style={styles.colName}>{item.name}</Text>
                <Text style={styles.groupCount}>{item.groupCount} Gruppen · {item.wordCount} Wörter</Text>
              </View>
              <Text style={styles.groupArrow}>›</Text>
            </TouchableOpacity>
            {item.name !== 'First vocabulary' && (
              <TouchableOpacity style={styles.groupDelBtn} onPress={() => deleteCollection(item.name)}>
                <Text style={styles.groupDelBtnText}>🗑</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* New Collection Modal */}
      <Modal visible={newColModal} transparent animationType="slide" onRequestClose={() => setNewColModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Neue Sammlung</Text>
            <TextInput
              style={styles.input} placeholder="Name der Sammlung" placeholderTextColor="#555"
              value={newColName} onChangeText={setNewColName}
              returnKeyType="done" onSubmitEditing={createCollection} autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => { setNewColModal(false); setNewColName(''); }}>
                <Text style={styles.modalBtnCancelText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnAdd]} onPress={createCollection}>
                <Text style={styles.modalBtnAddText}>Erstellen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', paddingTop: 12 },

  title: { fontSize: 24, fontWeight: '700', color: '#a78bfa', letterSpacing: 1, marginBottom: 20 },

  // ── Top header (groups screen) ─────────────────────────
  topHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', paddingHorizontal: 16, marginBottom: 12,
  },
  topHeaderTitle: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },

  // ── List ───────────────────────────────────────────────
  list:        { width: '100%' },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  listHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listTitle:   { color: '#a78bfa', fontSize: 16, fontWeight: '700' },
  addBtn:      { backgroundColor: '#4f46e5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText:  { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyText:      { color: '#555', textAlign: 'center', marginTop: 20, fontSize: 14 },
  emptyAddBtn:    { backgroundColor: '#2d2d4e', borderRadius: 14, padding: 20, alignItems: 'center', marginTop: 20 },
  emptyAddBtnText:{ color: '#a78bfa', fontSize: 16, fontWeight: '600' },

  // ── Collection item ────────────────────────────────────
  colItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#16213e', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 18, marginBottom: 10,
  },
  colName: { color: '#eee', fontSize: 18, fontWeight: '700' },

  // ── Group row (item + add button) ──────────────────────
  groupRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  groupItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#16213e', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
  },
  groupLeft:  {},
  groupName:  { color: '#eee', fontSize: 16, fontWeight: '700' },
  groupCount: { color: '#888', fontSize: 13, marginTop: 2 },
  groupStat:  { color: '#4f46e5', fontSize: 12, marginTop: 2, fontWeight: '600' },
  groupArrow: { color: '#4f46e5', fontSize: 26 },
  groupAddBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#2d2d4e',
    alignItems: 'center', justifyContent: 'center',
  },
  groupAddBtnText: { color: '#a78bfa', fontSize: 22, fontWeight: '300', lineHeight: 26 },
  groupDelBtn:     { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2d1515', alignItems: 'center', justifyContent: 'center' },
  groupDelBtnText: { fontSize: 18 },

  // ── Word list modal ────────────────────────────────────
  wordListHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  wordListClose:   { color: '#888', fontSize: 20, paddingLeft: 12 },
  wordListItem:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  wordListPair:    { flex: 1 },
  wordListEn:      { color: '#eee', fontSize: 15, fontWeight: '600' },
  wordListDe:      { color: '#888', fontSize: 13, marginTop: 2 },

  // ── Session header ─────────────────────────────────────
  sessHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', paddingHorizontal: 16, marginBottom: 12,
  },
  backBtn:       { width: 70 },
  backBtnText:   { color: '#a78bfa', fontSize: 16 },
  sessGroupName: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  modeBadge:     { color: '#a78bfa', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },

  // ── Progress ───────────────────────────────────────────
  progWrap:  { width: '100%', paddingHorizontal: 16, marginBottom: 4 },
  progTrack: { height: 6, backgroundColor: '#2d2d4e', borderRadius: 3, overflow: 'hidden' },
  progFill:  { height: '100%', backgroundColor: '#a78bfa', borderRadius: 3 },
  progText:  { color: '#888', fontSize: 12, marginTop: 4, textAlign: 'right' },
  queueInfo: { color: '#555', fontSize: 13, marginBottom: 14 },

  // ── Card ───────────────────────────────────────────────
  cardArea: { width: 320, height: 200, marginBottom: 12 },
  card: {
    position: 'absolute', width: '100%', height: '100%',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 24,
    backfaceVisibility: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  cardFront: { backgroundColor: '#4f46e5' },
  cardBack:  { backgroundColor: '#0f766e' },
  cardLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 10 },
  cardWord:  { fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' },
  cardHint:  { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 12 },

  // ── Hint ───────────────────────────────────────────────
  hintBtn:     { paddingVertical: 8, paddingHorizontal: 20, marginBottom: 8 },
  hintBtnText: { color: '#555', fontSize: 13, textAlign: 'center' },
  hintOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  hintBox:     { backgroundColor: '#16213e', borderRadius: 18, padding: 24, width: '100%' },
  hintWord:    { color: '#a78bfa', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  hintDef:     { color: '#ddd', fontSize: 15, lineHeight: 22 },
  hintClose:   { color: '#444', fontSize: 12, marginTop: 16, textAlign: 'center' },

  // ── Action buttons ─────────────────────────────────────
  actionRow:              { flexDirection: 'row', gap: 14, paddingHorizontal: 16 },
  actionBtn:              { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionWrong:            { backgroundColor: '#7f1d1d' },
  actionRight:            { backgroundColor: '#14532d' },
  actionIcon:             { fontSize: 24, color: '#fff', fontWeight: '700' },
  actionLabel:            { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: '600' },
  actionRowPlaceholder:   { height: 82, alignItems: 'center', justifyContent: 'center' },
  flipHint:               { color: '#444', fontSize: 13 },

  // ── Done screen ────────────────────────────────────────
  doneWrap:         { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  doneStar:         { fontSize: 64, color: '#fbbf24', marginBottom: 16 },
  doneTitle:        { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12 },
  doneSub:          { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 8, lineHeight: 24 },
  doneCount:        { fontSize: 14, color: '#4f46e5', fontWeight: '700', marginBottom: 28 },
  doneBtn:          { backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, marginBottom: 12, width: '100%', alignItems: 'center' },
  doneBtnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
  doneBtnGhost:     { paddingVertical: 14, width: '100%', alignItems: 'center' },
  doneBtnGhostText: { color: '#a78bfa', fontSize: 15 },

  // ── Mode modal ─────────────────────────────────────────
  modeOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modeBox:         { backgroundColor: '#16213e', borderRadius: 20, padding: 24, width: '100%' },
  modeTitle:       { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  modeSub:         { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modeOption:      { backgroundColor: '#4f46e5', borderRadius: 14, padding: 18, marginBottom: 12, alignItems: 'center' },
  modeOptionAlt:   { backgroundColor: '#0f766e' },
  modeOptionLang:  { color: '#fff', fontSize: 18, fontWeight: '700' },
  modeOptionArrow: { color: 'rgba(255,255,255,0.6)', fontSize: 20, marginVertical: 2 },
  modeOptionDesc:  { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 },
  modeCancelBtn:   { alignItems: 'center', paddingTop: 8 },
  modeCancelText:  { color: '#888', fontSize: 15 },

  // ── Add word / new collection modal ────────────────────
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox:           { backgroundColor: '#16213e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle:         { color: '#a78bfa', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalGroupLabel:    { color: '#888', fontSize: 13, marginBottom: 10 },
  input:              { backgroundColor: '#0f0f23', borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 14, color: '#eee', fontSize: 16, marginBottom: 10 },
  chips:              { marginBottom: 12 },
  chip:               { borderWidth: 1, borderColor: '#333', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  chipActive:         { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText:           { color: '#888', fontSize: 13 },
  chipTextActive:     { color: '#fff' },
  modalButtons:       { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn:           { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  modalBtnCancel:     { backgroundColor: '#2d2d4e' },
  modalBtnCancelText: { color: '#aaa', fontWeight: '600' },
  modalBtnAdd:        { backgroundColor: '#4f46e5' },
  modalBtnAddText:    { color: '#fff', fontWeight: '600' },
});


import { Component, Vue } from 'vue-property-decorator';
import Icon from '../assets/icon/Icon';
import moment from 'moment';

@Component({})
export class BaseMixin extends Vue {
    name: string = '';
    Icon = Icon;
    locals = localStorage.getItem('LANG');

    isButtonEnabled(buttonName: string) {
        return !this.$store.state.buttons.has(buttonName);
    }
}
